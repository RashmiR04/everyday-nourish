import { MEALS, MEAL_TYPES, DAYS } from "./meals";
import { BABY_MEALS, NUTRIENTS } from "./babyMeals";
import { Meal, WeekPlan, ConcernId, BabyMeal, BabyStage, NutrientId, MealType, Ingredient } from "./types";
import { computeNutritionFromIngredients } from "./ingredientNutrition";

// Rough share of daily energy each meal type should carry (sums to 1.0) — used
// to scale each meal type toward its own share of the day's target, instead of
// one flat multiplier applied to whatever each dish's base calories happened to
// be (which produced wildly uneven meals, e.g. an 870kcal lunch next to a
// 200kcal snack on the same day).
const MEAL_TYPE_ENERGY_SHARE: Record<MealType, number> = {
  breakfast: 0.225,
  lunch: 0.325,
  snack: 0.125,
  dinner: 0.325,
};

function scoreMeal(meal: Meal, concerns: ConcernId[], ingredientsOnHand: string[]): number {
  let score = 0;
  concerns.forEach((c) => {
    if (meal.concernTags.includes(c)) score += 2;
  });
  const ingredientNames = meal.ingredients.map((i) => i.name.toLowerCase());
  ingredientsOnHand.forEach((ing) => {
    if (ingredientNames.some((n) => n.includes(ing.toLowerCase()))) score += 1;
  });
  return score;
}

// Portion scaling is capped at 1.5x the base recipe — beyond that, a single
// dish starts turning into an implausibly large plate (a 300g bowl scaled to
// 600g+) rather than a believable serving. Days that still fall short after
// this cap get a small separate top-up item instead (see buildTopUp below),
// rather than stretching one dish further.
const MAX_PORTION_SCALE = 1.5;

// A small, realistic top-up added when a day's energy still falls short even
// at MAX_PORTION_SCALE — combining a modest fruit+nuts item rather than
// inflating one dish into an oversized portion.
const TOP_UP_INGREDIENTS: Ingredient[] = [
  { name: "Seasonal fruit", qty: "100g" },
  { name: "Roasted peanuts (groundnut)", qty: "15g" },
];
const TOP_UP_MAX_SCALE = 2;

function buildTopUp(gapKcal: number): Meal {
  const base = computeNutritionFromIngredients(TOP_UP_INGREDIENTS);
  const factor = Math.min(TOP_UP_MAX_SCALE, Math.max(1, gapKcal / base.caloriesPerServing));
  const ingredients = TOP_UP_INGREDIENTS.map((ing) => ({ ...ing, qty: scaleQty(ing.qty, factor) }));
  const nutrition = computeNutritionFromIngredients(ingredients);
  return {
    id: "topup",
    name: "Fruit & Nuts Top-up",
    mealType: "snack",
    cookTimeMinutes: 2,
    servingSize: scaleServingSize("1 small bowl (~115g)", factor),
    ingredients,
    recipeSteps: ["Serve the fruit and peanuts together alongside today's meals."],
    concernTags: [],
    concernNotes: {},
    generalNote: {
      note: "Added because today's planned meals fall short of your estimated energy need even at a realistic portion size — a small separate top-up instead of stretching one dish into an oversized serving.",
      source: "USDA FoodData Central",
    },
    ...nutrition,
    portionScale: factor > 1.05 ? factor : undefined,
  };
}

function scaleQty(qty: string, factor: number): string {
  const gramOrMl = qty.match(/^(\d+(?:\.\d+)?)(g|ml)$/);
  if (gramOrMl) {
    return `${Math.round(parseFloat(gramOrMl[1]) * factor)}${gramOrMl[2]}`;
  }
  const pieces = qty.match(/^(\d+(?:\.\d+)?)\s*(pieces?)$/);
  if (pieces) {
    return `${Math.max(1, Math.round(parseFloat(pieces[1]) * factor))} ${pieces[2]}`;
  }
  return qty;
}

// The "(~160g)"-style weight inside servingSize is the only part of that
// descriptive text scaling can update mechanically — item counts ("2 chillas")
// are left as-is, same honest tradeoff as piece-based ingredients not scaling
// smoothly. Without this, a scaled dish could show a stale "~40g" next to a
// tripled calorie count, which looks implausible even though the math is right.
function scaleServingSize(servingSize: string, factor: number): string {
  return servingSize.replace(/~(\d+(?:\.\d+)?)g/, (_, grams) => `~${Math.round(parseFloat(grams) * factor)}g`);
}

function scaleMeal(meal: Meal, factor: number): Meal {
  if (Math.abs(factor - 1) < 0.05) return meal;
  // Scale the ingredient quantities, then recompute nutrition from those
  // scaled quantities (rather than separately scaling the stored macros),
  // so the displayed ingredients and nutrition can never drift apart.
  const ingredients = meal.ingredients.map((ing) => ({ ...ing, qty: scaleQty(ing.qty, factor) }));
  return {
    ...meal,
    ingredients,
    servingSize: scaleServingSize(meal.servingSize, factor),
    ...computeNutritionFromIngredients(ingredients),
    portionScale: factor,
  };
}

/**
 * Generates a 7-day plan. For each meal slot, ranks the available dishes of
 * that type by relevance (selected concerns + ingredients on hand) and
 * cycles through them across the week. Most relevant dish appears most often;
 * with a small dataset, some repetition across the week is expected and honest
 * rather than hidden.
 *
 * If targetEnergyKcal is given, every dish is individually scaled toward its
 * meal type's share of THAT day's target (MEAL_TYPE_ENERGY_SHARE), capped at
 * MAX_PORTION_SCALE. Scaling per-dish rather than using one week-average
 * factor per meal type keeps every day close to the target, instead of
 * days swinging by 600+ kcal depending on which dishes happened to land
 * together that day.
 */
export function generatePlan(concerns: ConcernId[], ingredientsOnHand: string[], targetEnergyKcal?: number): WeekPlan {
  const plan = {} as WeekPlan;
  MEAL_TYPES.forEach((type) => {
    const pool = MEALS.filter((m) => m.mealType === type);
    const ranked = [...pool].sort(
      (a, b) => scoreMeal(b, concerns, ingredientsOnHand) - scoreMeal(a, concerns, ingredientsOnHand)
    );
    plan[type] = DAYS.map((_, i) => ranked[i % ranked.length]);
  });

  if (targetEnergyKcal) {
    MEAL_TYPES.forEach((type) => {
      const mealTarget = targetEnergyKcal * MEAL_TYPE_ENERGY_SHARE[type];
      plan[type] = plan[type].map((m) => {
        const factor = Math.min(MAX_PORTION_SCALE, Math.max(1, mealTarget / m.caloriesPerServing));
        return scaleMeal(m, factor);
      });
    });
  }

  return plan;
}

/**
 * Generates a 7-day baby plan for a given stage, greedily picking each day's
 * dish to maximize coverage of the least-represented nutrients so far this
 * week, while avoiding repeating the same dish on consecutive days when an
 * alternative exists.
 */
export function generateBabyPlan(stage: BabyStage): BabyMeal[] {
  const pool = BABY_MEALS.filter((m) => m.stage === stage);
  const coverage: Record<string, number> = {};
  NUTRIENTS.forEach((n) => (coverage[n] = 0));
  const plan: BabyMeal[] = [];
  let lastId: string | null = null;

  for (let day = 0; day < 7; day++) {
    let best: BabyMeal | null = null;
    let bestScore = -Infinity;
    pool.forEach((meal) => {
      if (meal.id === lastId && pool.length > 1) return;
      let score = 0;
      meal.nutrientsCovered.forEach((n: NutrientId) => {
        score += 7 - coverage[n];
      });
      if (score > bestScore) {
        bestScore = score;
        best = meal;
      }
    });
    if (!best) break;
    plan.push(best);
    (best as BabyMeal).nutrientsCovered.forEach((n: NutrientId) => (coverage[n] += 1));
    lastId = (best as BabyMeal).id;
  }
  return plan;
}

export function computeNutrientCoverage(babyPlan: BabyMeal[]): Record<string, number> {
  const coverage: Record<string, number> = {};
  NUTRIENTS.forEach((n) => (coverage[n] = 0));
  babyPlan.forEach((meal) => meal.nutrientsCovered.forEach((n) => (coverage[n] += 1)));
  return coverage;
}

export function computeDailyTotals(plan: WeekPlan, dayIndex: number) {
  let kcal = 0, proteinG = 0, carbsG = 0, fatG = 0, fiberG = 0;
  MEAL_TYPES.forEach((type) => {
    const meal = plan[type][dayIndex];
    kcal += meal.caloriesPerServing;
    proteinG += meal.macros.proteinG;
    carbsG += meal.macros.carbsG;
    fatG += meal.macros.fatG;
    fiberG += meal.macros.fiberG;
  });
  return { kcal, proteinG, carbsG, fatG: Math.round(fatG * 10) / 10, fiberG };
}

/**
 * Returns a small top-up item for a day whose planned meals (computed via
 * computeDailyTotals) still fall below 90% of the energy target even after
 * each dish was scaled up to MAX_PORTION_SCALE — or null if the day doesn't
 * need one.
 */
export function computeDayTopUp(plan: WeekPlan, dayIndex: number, targetEnergyKcal: number): Meal | null {
  const totals = computeDailyTotals(plan, dayIndex);
  if (totals.kcal >= targetEnergyKcal * 0.9) return null;
  return buildTopUp(targetEnergyKcal - totals.kcal);
}
