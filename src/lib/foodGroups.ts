import { Meal } from "./types";

// A lightweight, keyword-based variety check against the ingredient names
// already in the dataset — not a nutrient-by-nutrient analysis. Intended to
// answer "does today include a reasonable spread of food groups", not to
// replace the gram-level macro numbers shown elsewhere.
export type FoodGroup = "vegetables" | "fruit" | "pulses" | "wholeGrains" | "nutsSeeds" | "dairy";

const KEYWORDS: Record<FoodGroup, string[]> = {
  vegetables: [
    "capsicum", "carrot", "onion", "tomato", "potato", "cauliflower", "cabbage",
    "spinach", "lauki", "bottle gourd", "french beans", "green peas", "mushroom",
    "fenugreek", "sweet potato",
  ],
  fruit: ["pomegranate", "seasonal fruit"],
  pulses: ["besan", "moong", "toor dal", "rajma", "chana", "soya", "soy nuts", "tofu", "dal"],
  wholeGrains: ["rice", "oats", "jowar", "ragi", "whole wheat"],
  nutsSeeds: ["almond", "chia", "flaxseed", "peanut"],
  dairy: ["curd", "paneer", "milk"],
};

export const FOOD_GROUP_LABELS: Record<FoodGroup, string> = {
  vegetables: "Vegetables",
  fruit: "Fruit",
  pulses: "Pulses/legumes",
  wholeGrains: "Whole grains/millets",
  nutsSeeds: "Nuts/seeds",
  dairy: "Dairy",
};

export function detectFoodGroups(dishes: Meal[]): { present: Record<FoodGroup, boolean>; fruitServings: number } {
  const groups = Object.keys(KEYWORDS) as FoodGroup[];
  const present = Object.fromEntries(groups.map((g) => [g, false])) as Record<FoodGroup, boolean>;
  let fruitServings = 0;

  dishes.forEach((dish) => {
    let dishHasFruit = false;
    dish.ingredients.forEach((ing) => {
      const name = ing.name.toLowerCase();
      groups.forEach((g) => {
        if (KEYWORDS[g].some((kw) => name.includes(kw))) {
          present[g] = true;
          if (g === "fruit") dishHasFruit = true;
        }
      });
    });
    if (dishHasFruit) fruitServings += 1;
  });

  return { present, fruitServings };
}
