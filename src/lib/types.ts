export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export type ConcernId =
  | "triglycerides"
  | "hdl"
  | "ldl"
  | "diabetes"
  | "bp"
  | "iron"
  | "pcos"
  | "thyroid"
  | "digestion"
  | "weightLoss";

export interface Ingredient {
  name: string;
  qty: string;
}

export interface ConcernNote {
  note: string;
  source: string;
}

export interface MacroNutrients {
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export interface Meal {
  id: string;
  name: string;
  mealType: MealType;
  cookTimeMinutes: number;
  servingSize: string;
  caloriesPerServing: number;
  macros: MacroNutrients;
  ingredients: Ingredient[];
  recipeSteps: string[];
  concernTags: ConcernId[];
  concernNotes: Partial<Record<ConcernId, ConcernNote>>;
  generalNote: ConcernNote;
  portionScale?: number;
}

export type BabyStage = "6-8m" | "8-12m";

export type NutrientId =
  | "iron"
  | "zinc"
  | "protein"
  | "fats"
  | "vitaminA"
  | "vitaminC"
  | "calcium";

export interface NutrientNote {
  note: string;
  source: string;
}

export interface BabyMeal {
  id: string;
  name: string;
  stage: BabyStage;
  texture: string;
  caloriesPerServing: number | null;
  nutrientsCovered: NutrientId[];
  nutrientNotes: Partial<Record<NutrientId, NutrientNote>>;
  ingredients: Ingredient[];
  recipeSteps: string[];
  allergenFlags: string[];
  safetyNotes: string[];
}

export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "moderate" | "active";

export interface Preferences {
  concerns: ConcernId[];
  ingredientsOnHand: string[];
  household: number;
  sex: Sex;
  age: number;
  weightKg: number;
  activityLevel: ActivityLevel;
}

export type WeekPlan = Record<MealType, Meal[]>;

export interface GroceryItem {
  name: string;
  display: string;
}
