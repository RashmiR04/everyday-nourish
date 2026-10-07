import { MEAL_TYPES } from "./meals";
import { WeekPlan, GroceryItem, Meal } from "./types";

function aggregateIngredients(
  meals: Meal[],
  household: number
): Record<string, { amount: number; unit: string; hasNumeric: boolean }> {
  const items: Record<string, { amount: number; unit: string; hasNumeric: boolean }> = {};
  meals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      const match = ing.qty.match(/([\d.]+)\s*(g|ml|pieces?)?/i);
      const amount = match ? parseFloat(match[1]) : null;
      const unit = match && match[2] ? match[2].toLowerCase().replace(/s$/, "") : "unit";
      const key = ing.name;
      if (!items[key]) items[key] = { amount: 0, unit, hasNumeric: amount !== null };
      if (amount !== null) items[key].amount += amount * household;
    });
  });
  return items;
}

function toDisplay(v: { amount: number; unit: string; hasNumeric: boolean }): string {
  return v.hasNumeric ? `${Math.round(v.amount)}${v.unit === "piece" ? " pieces" : v.unit}` : "as needed";
}

/**
 * Aggregates ingredient quantities across the full week's plan, scaled by
 * household size. Quantities with a parseable numeric amount (grams, ml,
 * pieces) are summed; anything else (e.g. "as per taste") is listed as
 * "as needed" rather than silently dropped or guessed.
 */
export function buildGroceryList(plan: WeekPlan, household: number): GroceryItem[] {
  const allMeals = MEAL_TYPES.flatMap((type) => plan[type]);
  const items = aggregateIngredients(allMeals, household);
  return Object.entries(items)
    .map(([name, v]) => ({ name, display: toDisplay(v) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Same aggregation, scoped to a single day's dishes and split into what's
 * already on hand (matched the same substring-match way as the rest of the
 * app's avoid/on-hand filtering) versus what still needs buying — for a
 * day-level "what do I need for today" view rather than the whole week.
 */
export function buildDayGroceryList(
  dayMeals: Meal[],
  household: number,
  ingredientsOnHand: string[]
): { needToBuy: GroceryItem[]; alreadyHave: GroceryItem[] } {
  const items = aggregateIngredients(dayMeals, household);
  const onHandLower = ingredientsOnHand.map((i) => i.toLowerCase());
  const needToBuy: GroceryItem[] = [];
  const alreadyHave: GroceryItem[] = [];
  Object.entries(items)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, v]) => {
      const have = onHandLower.some((h) => name.toLowerCase().includes(h));
      (have ? alreadyHave : needToBuy).push({ name, display: toDisplay(v) });
    });
  return { needToBuy, alreadyHave };
}
