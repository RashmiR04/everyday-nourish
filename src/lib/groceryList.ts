import { MEAL_TYPES } from "./meals";
import { WeekPlan, GroceryItem } from "./types";

/**
 * Aggregates ingredient quantities across the full week's plan, scaled by
 * household size. Quantities with a parseable numeric amount (grams, ml,
 * pieces) are summed; anything else (e.g. "as per taste") is listed as
 * "as needed" rather than silently dropped or guessed.
 */
export function buildGroceryList(plan: WeekPlan, household: number): GroceryItem[] {
  const items: Record<string, { amount: number; unit: string; hasNumeric: boolean }> = {};

  MEAL_TYPES.forEach((type) => {
    plan[type].forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        const match = ing.qty.match(/([\d.]+)\s*(g|ml|pieces?)?/i);
        const amount = match ? parseFloat(match[1]) : null;
        const unit = match && match[2] ? match[2].toLowerCase().replace(/s$/, "") : "unit";
        const key = ing.name;
        if (!items[key]) items[key] = { amount: 0, unit, hasNumeric: amount !== null };
        if (amount !== null) items[key].amount += amount * household;
      });
    });
  });

  return Object.entries(items)
    .map(([name, v]) => ({
      name,
      display: v.hasNumeric ? `${Math.round(v.amount)}${v.unit === "piece" ? " pieces" : v.unit}` : "as needed",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
