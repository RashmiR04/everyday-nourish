"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import Nav from "@/components/Nav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import MealCard from "@/components/MealCard";
import { generatePlan, computeDailyTotals } from "@/lib/planner";
import { MEAL_TYPES, DAYS } from "@/lib/meals";
import { loadPreferences } from "@/lib/storage";
import { Preferences, WeekPlan } from "@/lib/types";
import { ADULT_DAILY_REFERENCE, ADULT_DAILY_REFERENCE_SOURCE } from "@/lib/nutritionTargets";

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
    setPlan(generatePlan(loaded.concerns, loaded.ingredientsOnHand));
  }, [router]);

  if (!prefs || !plan) return null;

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

        {DAYS.map((day, i) => {
          const totals = computeDailyTotals(plan, i);
          return (
            <div key={day}>
              <div className="font-display text-ink text-base font-medium mb-2">{day}</div>
              <div className="rounded-xl border border-line bg-card px-4 py-3 mb-3 text-sm text-ink">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Energy: {totals.kcal} kcal{" "}
                    <span className="text-muted text-xs">
                      (ref: {ADULT_DAILY_REFERENCE.energyKcalMin}–{ADULT_DAILY_REFERENCE.energyKcalMax})
                    </span>
                  </span>
                  <span>
                    Protein: {totals.proteinG}g{" "}
                    <span className="text-muted text-xs">(ref: ≥{ADULT_DAILY_REFERENCE.proteinMinG}g)</span>
                  </span>
                  <span>
                    Fibre: {totals.fiberG}g{" "}
                    <span className="text-muted text-xs">(ref: ≥{ADULT_DAILY_REFERENCE.fiberMinG}g)</span>
                  </span>
                  <span>
                    Fat: {totals.fatG}g{" "}
                    <span className="text-muted text-xs">(ref: ≤{ADULT_DAILY_REFERENCE.fatMaxG}g)</span>
                  </span>
                </div>
                <div className="text-xs mt-1 text-muted">{ADULT_DAILY_REFERENCE_SOURCE}</div>
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
