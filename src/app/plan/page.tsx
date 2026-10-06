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
          return (
            <div key={day}>
              <div className="font-display text-ink text-base font-medium mb-2">{day}</div>
              <div className="rounded-xl border border-line bg-card px-4 py-3 mb-3 text-sm text-ink">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Energy: {totals.kcal} kcal{" "}
                    <span className="text-muted text-xs">(your target: ~{targets.energyKcal})</span>
                  </span>
                  <span>
                    Protein: {totals.proteinG}g{" "}
                    <span className="text-muted text-xs">(your target: ≥{targets.proteinG}g)</span>
                  </span>
                  <span>
                    Fibre: {totals.fiberG}g{" "}
                    <span className="text-muted text-xs">(ref: ≥{targets.fiberMinG}g)</span>
                  </span>
                  <span>
                    Fat: {totals.fatG}g{" "}
                    <span className="text-muted text-xs">(ref: ≤{targets.fatMaxG}g)</span>
                  </span>
                </div>
                <div className="text-xs mt-1 text-muted">{PERSONAL_TARGETS_SOURCE}</div>
                {totals.kcal < targets.energyKcal * 0.85 && (
                  <div className="text-xs mt-1 text-accentDeep">
                    This day falls noticeably short of your energy target even after portion scaling — consider an
                    extra snack or larger portions than shown.
                  </div>
                )}
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
