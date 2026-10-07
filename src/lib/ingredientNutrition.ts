import { Ingredient, MacroNutrients } from "./types";

export interface NutrientPer100 {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

// Per-100g (or per-100ml for liquids, per-piece for "Whole wheat roti" and
// "Almonds (soaked)" — both are always quantified in pieces in this dataset,
// never by weight) nutrition values, sourced from IFCT 2017 / USDA FoodData
// Central. Besan, toor dal,
// paneer, rolled oats, and almonds were cross-checked against published
// figures and corrected where off (see meals.ts header comment for details).
// "Onion-tomato masala" and "Onion, tomato, lemon" are documented estimates
// for a cooked tempering/salad mix, not single raw ingredients — everything
// else is a single ingredient with its own entry.
//
// This is the single source of truth for dish nutrition: every dish's
// caloriesPerServing/macros in meals.ts is computed from its ingredient list
// against this table (computeNutritionFromIngredients, below), not stored
// and hand-maintained independently.
export const INGREDIENT_NUTRITION: Record<string, NutrientPer100> = {
  "Besan (gram flour)": { kcal: 329, proteinG: 21.6, carbsG: 46.7, fatG: 5.3, fiberG: 15.2 },
  Capsicum: { kcal: 20, proteinG: 0.9, carbsG: 4.6, fatG: 0.2, fiberG: 1.7 },
  Onion: { kcal: 40, proteinG: 1.1, carbsG: 9.3, fatG: 0.1, fiberG: 1.7 },
  Carrot: { kcal: 41, proteinG: 0.9, carbsG: 9.6, fatG: 0.2, fiberG: 2.8 },
  Curd: { kcal: 65, proteinG: 3.5, carbsG: 4.7, fatG: 4.0, fiberG: 0 },
  "Curd (for raita)": { kcal: 65, proteinG: 3.5, carbsG: 4.7, fatG: 4.0, fiberG: 0 },
  "Rolled oats": { kcal: 379, proteinG: 13.15, carbsG: 67.7, fatG: 6.52, fiberG: 10.1 },
  "Flaxseed (ground)": { kcal: 534, proteinG: 18, carbsG: 29, fatG: 42, fiberG: 27 },
  "Green peas": { kcal: 81, proteinG: 5.4, carbsG: 14.5, fatG: 0.4, fiberG: 5.7 },
  "Split moong dal": { kcal: 347, proteinG: 24, carbsG: 59, fatG: 1.2, fiberG: 16 },
  "Moong dal": { kcal: 347, proteinG: 24, carbsG: 59, fatG: 1.2, fiberG: 16 },
  Spinach: { kcal: 23, proteinG: 2.9, carbsG: 3.6, fatG: 0.4, fiberG: 2.2 },
  "Toor dal": { kcal: 335, proteinG: 22.3, carbsG: 57.6, fatG: 1.7, fiberG: 15 },
  "Whole wheat roti": { kcal: 85, proteinG: 3, carbsG: 15, fatG: 0.4, fiberG: 2 }, // per piece
  Potato: { kcal: 97, proteinG: 1.6, carbsG: 22, fatG: 0.1, fiberG: 2.2 },
  Cauliflower: { kcal: 25, proteinG: 1.9, carbsG: 5, fatG: 0.3, fiberG: 2 },
  "Rajma (kidney beans)": { kcal: 333, proteinG: 24, carbsG: 60, fatG: 0.8, fiberG: 15 },
  "Brown rice": { kcal: 362, proteinG: 7.5, carbsG: 76, fatG: 2.7, fiberG: 3.5 },
  Tomato: { kcal: 18, proteinG: 0.9, carbsG: 3.9, fatG: 0.2, fiberG: 1.2 },
  "Whole wheat flour": { kcal: 341, proteinG: 12, carbsG: 69, fatG: 1.7, fiberG: 11 },
  "Fenugreek leaves": { kcal: 49, proteinG: 4.4, carbsG: 6, fatG: 0.9, fiberG: 2 },
  Paneer: { kcal: 318, proteinG: 21.2, carbsG: 3.5, fatG: 25, fiberG: 0 },
  Rice: { kcal: 345, proteinG: 7, carbsG: 78, fatG: 0.5, fiberG: 1 },
  "Roasted chana": { kcal: 364, proteinG: 20, carbsG: 60, fatG: 5, fiberG: 12 },
  "Seasonal fruit": { kcal: 60, proteinG: 0.5, carbsG: 15, fatG: 0.2, fiberG: 2.5 },
  "Almonds (soaked)": { kcal: 6.9, proteinG: 0.25, carbsG: 0.26, fatG: 0.6, fiberG: 0.15 }, // per piece (~1.2g/almond)
  "Chia seeds": { kcal: 486, proteinG: 17, carbsG: 42, fatG: 31, fiberG: 34 },
  "Sprouted moong": { kcal: 32, proteinG: 3, carbsG: 5.5, fatG: 0.2, fiberG: 1.8 },
  "Onion, tomato, lemon": { kcal: 25, proteinG: 1, carbsG: 5, fatG: 0.1, fiberG: 1.5 },
  "Jowar flour": { kcal: 349, proteinG: 10, carbsG: 73, fatG: 3.3, fiberG: 9.7 },
  "Bottle gourd (lauki)": { kcal: 15, proteinG: 0.6, carbsG: 3.4, fatG: 0.1, fiberG: 1.2 },
  "Cooked rice": { kcal: 130, proteinG: 2.7, carbsG: 28, fatG: 0.3, fiberG: 0.4 },
  Pomegranate: { kcal: 83, proteinG: 1.7, carbsG: 19, fatG: 1.2, fiberG: 4 },
  Cabbage: { kcal: 25, proteinG: 1.3, carbsG: 5.8, fatG: 0.1, fiberG: 2.5 },
  "French beans": { kcal: 31, proteinG: 1.8, carbsG: 7, fatG: 0.2, fiberG: 3.4 },
  "Soya chunks (dry)": { kcal: 345, proteinG: 52, carbsG: 33, fatG: 0.5, fiberG: 13 },
  "Onion-tomato masala": { kcal: 70, proteinG: 1.2, carbsG: 7, fatG: 4.5, fiberG: 1.5 },
  "Roasted soy nuts (soybeans)": { kcal: 471, proteinG: 40, carbsG: 33, fatG: 25, fiberG: 15 },
  Tofu: { kcal: 76, proteinG: 8, carbsG: 1.9, fatG: 4.8, fiberG: 0.3 },
  Milk: { kcal: 58, proteinG: 3.1, carbsG: 4.7, fatG: 3.0, fiberG: 0 }, // per 100ml
  "Ragi (finger millet) flour": { kcal: 336, proteinG: 7.3, carbsG: 72, fatG: 1.3, fiberG: 11.5 },
  "Roasted peanuts (groundnut)": { kcal: 567, proteinG: 25.8, carbsG: 16, fatG: 49, fiberG: 8.5 },
  "Sweet potato": { kcal: 86, proteinG: 1.6, carbsG: 20, fatG: 0.1, fiberG: 3 },
  "Button mushroom": { kcal: 22, proteinG: 3.1, carbsG: 3.3, fatG: 0.3, fiberG: 1 },
};

// Names a "My recipes" ingredient picker can offer, since every dish's
// nutrition must come from this table (no free-text ingredients).
export const INGREDIENT_NAMES: string[] = Object.keys(INGREDIENT_NUTRITION).sort();

// Entries stated per-piece rather than per-100g/ml — a custom-recipe picker
// must default these to a "piece" unit instead of grams, since a per-piece
// value scaled as if it were per-100g would wildly overstate calories (the
// exact bug this dataset hit before, see comment above on "Almonds (soaked)").
export const PER_PIECE_INGREDIENTS = ["Whole wheat roti", "Almonds (soaked)"];

function parseQty(qty: string): { amount: number; perPiece: boolean } | null {
  const gramOrMl = qty.match(/^(\d+(?:\.\d+)?)(?:g|ml)$/);
  if (gramOrMl) return { amount: parseFloat(gramOrMl[1]), perPiece: false };
  const pieces = qty.match(/^(\d+(?:\.\d+)?)\s*pieces?$/);
  if (pieces) return { amount: parseFloat(pieces[1]), perPiece: true };
  return null;
}

export function computeNutritionFromIngredients(ingredients: Ingredient[]): {
  caloriesPerServing: number;
  macros: MacroNutrients;
} {
  let kcal = 0,
    proteinG = 0,
    carbsG = 0,
    fatG = 0,
    fiberG = 0;

  ingredients.forEach((ing) => {
    const ref = INGREDIENT_NUTRITION[ing.name];
    const parsed = parseQty(ing.qty);
    if (!ref || !parsed) {
      if (!ref) console.warn(`[ingredientNutrition] No nutrition data for "${ing.name}"`);
      return;
    }
    // Per-piece entries (roti) use amount directly; per-100g/ml entries scale
    // by amount/100 since the ref values are stated per 100g or 100ml.
    const factor = parsed.perPiece ? parsed.amount : parsed.amount / 100;
    kcal += ref.kcal * factor;
    proteinG += ref.proteinG * factor;
    carbsG += ref.carbsG * factor;
    fatG += ref.fatG * factor;
    fiberG += ref.fiberG * factor;
  });

  return {
    caloriesPerServing: Math.round(kcal),
    macros: {
      proteinG: Math.round(proteinG),
      carbsG: Math.round(carbsG),
      fatG: Math.round(fatG * 10) / 10,
      fiberG: Math.round(fiberG),
    },
  };
}
