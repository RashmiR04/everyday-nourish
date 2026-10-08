import { generatePlan } from "./planner";
import { DAYS } from "./meals";
import { ConcernId } from "./types";
import type { SampleDay } from "@/components/SeoLandingPage";

// Builds the sample week shown on SEO landing pages from the same
// generatePlan() the real app uses, instead of a hand-typed dish list —
// so these marketing pages can never drift out of sync with the actual
// dataset (e.g. a renamed or removed dish silently going stale here).
// No targetEnergyKcal is passed, since these are unpersonalized samples —
// dish names aren't affected by portion scaling anyway.
export function buildSampleWeek(concerns: ConcernId[] = []): SampleDay[] {
  const plan = generatePlan(concerns, [], undefined, []);
  return DAYS.map((day, i) => ({
    day,
    breakfast: plan.breakfast[i].name,
    lunch: plan.lunch[i].name,
    snack: plan.snack[i].name,
    dinner: plan.dinner[i].name,
  }));
}
