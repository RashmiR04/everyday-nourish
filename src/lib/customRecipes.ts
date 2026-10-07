import { Ingredient, Meal, MealType } from "./types";
import { computeNutritionFromIngredients } from "./ingredientNutrition";

export interface CustomRecipeInput {
  name: string;
  mealType: MealType;
  servingSize: string;
  ingredients: Ingredient[];
  recipeSteps: string[];
}

// Builds a full Meal from a user-entered recipe so it can slot into the same
// plan/swap/grocery-list pipeline as the built-in dishes. Nutrition always
// comes from computeNutritionFromIngredients against the known ingredient
// table — never hand-entered — so a "custom" dish is still a real computed
// number, not a free-text guess.
export function buildCustomMeal(input: CustomRecipeInput): Meal {
  const nutrition = computeNutritionFromIngredients(input.ingredients);
  return {
    id: `custom-${Date.now()}`,
    name: input.name,
    mealType: input.mealType,
    cookTimeMinutes: 20,
    servingSize: input.servingSize.trim() || "1 serving",
    ingredients: input.ingredients,
    recipeSteps: input.recipeSteps.filter((s) => s.trim().length > 0),
    concernTags: [],
    concernNotes: {},
    generalNote: {
      note: "This is a recipe you added yourself. Calories and nutrients are calculated from the ingredients and quantities you picked, the same way as every other dish in the app.",
      source: "Computed from IFCT 2017 / USDA FoodData Central values for the ingredients you selected",
    },
    ...nutrition,
  };
}
