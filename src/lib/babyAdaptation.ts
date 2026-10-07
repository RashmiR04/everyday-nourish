import { BabyStage } from "./types";

// General guidance for adapting a shared family dish for a baby, by WHO-aligned
// stage (see babyMeals.ts for the same stage definitions). This is deliberately
// generic texture/safety guidance, not a substitute for computed baby nutrition
// (that stays on the dedicated Baby's plan) or for a pediatrician's advice.
export const BABY_ADAPTATION_NOTE: Record<BabyStage, string> = {
  "6-8m":
    "Many babies this age are still on single-food purees rather than sharing family meals — see Baby's plan for age-appropriate dishes, and go by your pediatrician's guidance for your baby specifically.",
  "9-11m":
    "You can typically set a small portion aside before adding chilli, extra spice, or salt, and mash or finely chop it to a soft texture — adjust based on your own baby's readiness and your pediatrician's guidance.",
  "12-23m":
    "You can typically set a small portion aside before adding chilli or extra spice, keep it mild, and cut into soft, baby-safe pieces — adjust based on your own baby's readiness and your pediatrician's guidance.",
};

// Whether a cook-instructions list should get an inserted "set aside baby's
// portion" step — not useful at 6-8m, since babies that age aren't sharing
// this dish at all (see note above).
export function needsBabyCookStep(stage: BabyStage): boolean {
  return stage !== "6-8m";
}
