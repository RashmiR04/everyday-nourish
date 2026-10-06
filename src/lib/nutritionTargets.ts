import { ActivityLevel, Sex } from "./types";

// ICMR-NIN Recommended Dietary Allowances (RDA) for Indians, 2020 — reference daily
// energy requirement for the adult (18-59y) reference-weight Indian, by sex and
// activity level. This is a population reference figure, not an individual
// measurement (ICMR-NIN's own tables are further broken down by exact age band;
// this app uses the general adult figure across 18-59y for simplicity).
const ENERGY_KCAL: Record<Sex, Record<ActivityLevel, number>> = {
  male: { sedentary: 2110, moderate: 2710, active: 3470 },
  female: { sedentary: 1660, moderate: 2130, active: 2720 },
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job, little exercise)",
  moderate: "Moderately active (some daily activity or exercise)",
  active: "Very active (physical job or intense regular exercise)",
};

export interface PersonalTargets {
  energyKcal: number;
  proteinG: number;
  fiberMinG: number;
  fatMaxG: number;
  carbsG: number;
}

export function computePersonalTargets(sex: Sex, weightKg: number, activityLevel: ActivityLevel): PersonalTargets {
  const energyKcal = ENERGY_KCAL[sex][activityLevel];
  // ICMR-NIN 2020: ~0.83g protein per kg body weight/day for a healthy adult on a
  // mixed diet (higher, ~1g/kg, is suggested for largely cereal-based diets with
  // lower-quality protein — this app uses the general 0.83g/kg figure).
  const proteinG = Math.round(weightKg * 0.83);
  // ICMR-NIN 2024 Dietary Guidelines' 2,000-kcal "My Plate for the Day" model uses
  // roughly a 15% protein / 30% fat / 55% carbohydrate split of total energy.
  const fatMaxG = Math.round((energyKcal * 0.3) / 9);
  const carbsG = Math.round((energyKcal * 0.55) / 4);
  const fiberMinG = 30;
  return { energyKcal, proteinG, fiberMinG, fatMaxG, carbsG };
}

export const PERSONAL_TARGETS_SOURCE =
  "Estimated from ICMR-NIN Recommended Dietary Allowances (RDA) for Indians, 2020 (energy by sex & activity level; protein ~0.83g/kg body weight) and the ICMR-NIN 2024 Dietary Guidelines' 2,000-kcal model macro split. A general estimate based on what you entered, not a medical prescription — actual needs can vary further by age, health status, and individual metabolism.";
