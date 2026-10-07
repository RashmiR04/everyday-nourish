import { BabyStage } from "./types";

// General guidance for adapting a shared family dish for a baby, by WHO-aligned
// stage (see babyMeals.ts for the same stage definitions). This is deliberately
// generic texture/safety guidance, not a substitute for computed baby nutrition
// (that stays on the dedicated Baby's plan) or for a pediatrician's advice.
export const BABY_ADAPTATION_NOTE: Record<BabyStage, string> = {
  "6-8m":
    "At this age, babies are usually still on single-food purees rather than sharing family meals — see Baby's plan for age-appropriate dishes instead of adapting this one.",
  "9-11m":
    "Take a small portion out before adding chilli, extra spice, or salt. Mash or finely chop to a soft, slightly textured consistency.",
  "12-23m":
    "Take a small portion out before adding chilli or extra spice, keep it mild, and cut into soft, baby-safe pieces a toddler can manage.",
};

// Whether a cook-instructions list should get an inserted "set aside baby's
// portion" step — not useful at 6-8m, since babies that age aren't sharing
// this dish at all (see note above).
export function needsBabyCookStep(stage: BabyStage): boolean {
  return stage !== "6-8m";
}
