import { ActivityLevel, Sex } from "./types";

// Schofield equations (weight-only form, kcal/day) from the FAO/WHO/UNU 1985
// expert consultation report, retained in the FAO/WHO 2001 report (Table 5.2).
// Estimates resting/basal metabolic rate from body weight, age band, and sex —
// this is what actually makes the energy target respond to the weight you enter,
// rather than a flat population figure by sex and activity level alone.
function basalMetabolicRate(sex: Sex, age: number, weightKg: number): number {
  if (sex === "male") {
    if (age < 30) return 15.057 * weightKg + 692.2;
    if (age < 60) return 11.472 * weightKg + 873.1;
    return 11.711 * weightKg + 587.7;
  }
  if (age < 30) return 14.818 * weightKg + 486.6;
  if (age < 60) return 8.126 * weightKg + 845.6;
  return 9.082 * weightKg + 658.5;
}

// Physical activity level (PAL) multipliers, standard values commonly used
// alongside Schofield/Harris-Benedict-style BMR estimates.
const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  moderate: 1.55,
  active: 1.725,
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

export function computePersonalTargets(
  sex: Sex,
  age: number,
  weightKg: number,
  activityLevel: ActivityLevel
): PersonalTargets {
  const bmr = basalMetabolicRate(sex, age, weightKg);
  const energyKcal = Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel]);
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
  "Energy estimated from the Schofield BMR equations (FAO/WHO/UNU, weight + age + sex) × an activity multiplier; protein from ICMR-NIN 2020 RDA (~0.83g/kg body weight); fat/carb split from the ICMR-NIN 2024 Dietary Guidelines' 2,000-kcal model. A general estimate based on what you entered, not a medical prescription — actual needs can vary further by health status and individual metabolism.";
