"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import Nav from "@/components/Nav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import MealCard from "@/components/MealCard";
import { generatePlan, computeDailyTotals } from "@/lib/planner";
import { MEAL_TYPES, DAYS, CONCERN_TAG_LABELS, CONCERN_PATTERN_GUIDANCE, CONCERN_PATTERN_DISCLAIMER } from "@/lib/meals";
import { loadPreferences } from "@/lib/storage";
import { Preferences, WeekPlan } from "@/lib/types";
import { computePersonalTargets, PERSONAL_TARGETS_SOURCE } from "@/lib/nutritionTargets";
import { detectFoodGroups, FOOD_GROUP_LABELS, FoodGroup } from "@/lib/foodGroups";

const pillClass = (ok: boolean) =>
  `text-xs px-2 py-0.5 rounded-full ${ok ? "bg-tagBg text-tagText" : "border border-line text-muted"}`;

export default function PlanPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);

  useEffect(() => {
    const loaded = loadPreferences();
    if (!loaded) {
      router.push("/plan/new");
      return;
    }
    setPrefs(loaded);
    const personalTargets = computePersonalTargets(loaded.sex, loaded.age, loaded.weightKg, loaded.activityLevel);
    setPlan(generatePlan(loaded.concerns, loaded.ingredientsOnHand, personalTargets.energyKcal));
  }, [router]);

  if (!prefs || !plan) return null;

  const targets = computePersonalTargets(prefs.sex, prefs.age, prefs.weightKg, prefs.activityLevel);

  return (
    <div>
      <Nav />
      <div className="space-y-6">
        <DisclaimerBanner />

        <div className="flex items-center justify-between">
          <Link href="/plan/new" className="text-sm text-accentDeep underline">
            Change preferences / regenerate
          </Link>
          <Link href="/plan/grocery-list" className="flex items-center gap-1.5 text-sm text-accentDeep">
            <ShoppingBasket size={16} /> Grocery list
          </Link>
        </div>

        {prefs.concerns.length > 0 && (
          <div className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink">
            <div className="font-medium mb-2">How this plan is adapted</div>
            <div className="space-y-2">
              {prefs.concerns.map((c) => (
                <div key={c}>
                  <div className="text-xs font-medium text-muted mb-0.5">{CONCERN_TAG_LABELS[c]}</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {CONCERN_PATTERN_GUIDANCE[c].map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-xs mt-2 text-muted">{CONCERN_PATTERN_DISCLAIMER}</div>
          </div>
        )}

        {DAYS.map((day, i) => {
          const totals = computeDailyTotals(plan, i);
          const dayDishes = MEAL_TYPES.map((type) => plan[type][i]);
          const { present, fruitServings } = detectFoodGroups(dayDishes);
          const proteinGood = totals.proteinG >= targets.proteinG;
          const fibreGood = totals.fiberG >= targets.fiberMinG;
          return (
            <div key={day}>
              <div className="font-display text-ink text-base font-medium mb-2">{day}</div>
              <div className="rounded-xl border border-line bg-card px-4 py-3 mb-3 text-sm text-ink">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Energy: {totals.kcal} kcal{" "}
                    <span className="text-muted text-xs">(estimated daily need: ~{targets.energyKcal} kcal)</span>
                  </span>
                  <span>
                    Protein: {totals.proteinG}g{" "}
                    <span className="text-muted text-xs">(target: ≥{targets.proteinG}g)</span>
                  </span>
                  <span>Carbs: {totals.carbsG}g</span>
                  <span>Fat: {totals.fatG}g</span>
                  <span>
                    Fibre: {totals.fiberG}g{" "}
                    <span className="text-muted text-xs">(target: ≥{targets.fiberMinG}g)</span>
                  </span>
                </div>
                <div className="text-xs mt-1 text-muted">
                  Carbs and fat aren&apos;t shown against a fixed gram target — the focus here is whole-food variety,
                  not gram-level restriction.
                </div>
                <div className="text-xs mt-1 text-muted">{PERSONAL_TARGETS_SOURCE}</div>
                {totals.kcal < targets.energyKcal * 0.85 && (
                  <div className="text-xs mt-1 text-accentDeep">
                    This day falls noticeably short of your estimated energy need even after portion scaling —
                    consider an extra snack or larger portions than shown.
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-line bg-card px-4 py-3 mb-3 text-sm text-ink">
                <div className="font-medium mb-2">Today&apos;s nutrition</div>
                <div className="flex flex-wrap gap-2">
                  <span className={pillClass(proteinGood)}>Protein: {proteinGood ? "Good" : "Low"}</span>
                  <span className={pillClass(fibreGood)}>Fibre: {fibreGood ? "Good" : "Low"}</span>
                  <span className={pillClass(fruitServings > 0)}>
                    Fruit: {fruitServings > 0 ? `${fruitServings} serving${fruitServings > 1 ? "s" : ""}` : "Not included today"}
                  </span>
                  {(["vegetables", "pulses", "wholeGrains", "nutsSeeds"] as FoodGroup[]).map((g) => (
                    <span key={g} className={pillClass(present[g])}>
                      {FOOD_GROUP_LABELS[g]}: {present[g] ? "Included" : "Not included today"}
                    </span>
                  ))}
                </div>
                <div className="text-xs mt-2 text-muted">
                  Based on the ingredients in today&apos;s dishes — a quick variety check, not a nutrient-by-nutrient
                  analysis.
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {MEAL_TYPES.map((type) => (
                  <MealCard key={type} meal={plan[type][i]} selectedConcerns={prefs.concerns} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
