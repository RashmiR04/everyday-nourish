import { MEALS, MEAL_TYPES, DAYS } from "./meals";
import { BABY_MEALS, NUTRIENTS } from "./babyMeals";
import { Meal, WeekPlan, ConcernId, BabyMeal, BabyStage, NutrientId, MealType } from "./types";
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

// Portion scaling is capped at 2x the base recipe — beyond that, doubling a dish
// stops being a realistic portion and the honest fix is more dishes per day, not
// a bigger single serving. A plan can still fall short of a high energy target
// (e.g. a very active, heavier build) even after this cap; that's surfaced in the
// UI rather than silently over-scaled.
const MAX_PORTION_SCALE = 2;

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

function scaleMeal(meal: Meal, factor: number): Meal {
  if (Math.abs(factor - 1) < 0.05) return meal;
  // Scale the ingredient quantities, then recompute nutrition from those
  // scaled quantities (rather than separately scaling the stored macros),
  // so the displayed ingredients and nutrition can never drift apart.
  const ingredients = meal.ingredients.map((ing) => ({ ...ing, qty: scaleQty(ing.qty, factor) }));
  return {
    ...meal,
    ingredients,
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
