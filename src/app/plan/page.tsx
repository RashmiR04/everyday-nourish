"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import Nav from "@/components/Nav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import MealCard from "@/components/MealCard";
import FeedbackWidget from "@/components/FeedbackWidget";
import { generatePlan, computeDailyTotals, computeDayTopUp, getMealOptions, swapDish } from "@/lib/planner";
import { MEAL_TYPES, DAYS, CONCERN_TAG_LABELS, CONCERN_PATTERN_GUIDANCE, CONCERN_PATTERN_DISCLAIMER } from "@/lib/meals";
import {
  loadPreferences,
  loadPlan,
  savePlan,
  isReturningVisitor,
  loadCustomRecipes,
  loadCompletedMeals,
  saveCompletedMeals,
} from "@/lib/storage";
import { Meal, MealType, Preferences, WeekPlan } from "@/lib/types";
import { computePersonalTargets, PERSONAL_TARGETS_SOURCE } from "@/lib/nutritionTargets";
import { detectFoodGroups } from "@/lib/foodGroups";
import { track } from "@vercel/analytics";

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
      style={{ backgroundColor: ok ? "#4B5D3A" : "#A8732A" }}
    />
  );
}

function BalanceItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full border border-line text-ink inline-flex items-center">
      <Dot ok={ok} /> {label}
    </span>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [customRecipes, setCustomRecipes] = useState<Meal[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loaded = loadPreferences();
    if (!loaded) {
      router.push("/plan/new");
      return;
    }
    setPrefs(loaded);
    setCustomRecipes(loadCustomRecipes());
    setCompleted(loadCompletedMeals());
    // Prefer the saved plan (preserves any swaps) over regenerating from
    // scratch. Only falls back to generating fresh if none was saved yet —
    // normally /plan/new always saves one before sending the user here.
    const saved = loadPlan();
    if (saved) {
      setPlan(saved);
    } else {
      const personalTargets = computePersonalTargets(loaded.sex, loaded.age, loaded.weightKg, loaded.activityLevel);
      const fresh = generatePlan(loaded.concerns, loaded.ingredientsOnHand, personalTargets.energyKcal, loaded.avoidIngredients);
      savePlan(fresh);
      setPlan(fresh);
    }
    track("plan_viewed", { returningVisitor: isReturningVisitor() });
  }, [router]);

  if (!prefs || !plan) return null;

  const targets = computePersonalTargets(prefs.sex, prefs.age, prefs.weightKg, prefs.activityLevel);

  const handleSwap = (type: MealType, dayIndex: number, newDishId: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const updated = swapDish(prev, type, dayIndex, newDishId, targets.energyKcal, customRecipes);
      savePlan(updated);
      return updated;
    });
  };

  const toggleComplete = (key: string) => {
    setCompleted((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveCompletedMeals(updated);
      return updated;
    });
  };

  return (
    <div>
      <Nav />
      <div className="space-y-6">
        <DisclaimerBanner />

        <div className="flex items-center justify-between">
          <Link href="/plan/new" className="text-sm text-accentDeep underline">
            Change preferences / regenerate
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/my-recipes" className="text-sm text-accentDeep underline">
              My recipes
            </Link>
            <Link href="/plan/grocery-list" className="flex items-center gap-1.5 text-sm text-accentDeep">
              <ShoppingBasket size={16} /> Grocery list
            </Link>
          </div>
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
          const baseTotals = computeDailyTotals(plan, i);
          const topUp = computeDayTopUp(plan, i, targets.energyKcal);
          const totals = topUp
            ? {
                kcal: baseTotals.kcal + topUp.caloriesPerServing,
                proteinG: baseTotals.proteinG + topUp.macros.proteinG,
                carbsG: baseTotals.carbsG + topUp.macros.carbsG,
                fatG: Math.round((baseTotals.fatG + topUp.macros.fatG) * 10) / 10,
                fiberG: baseTotals.fiberG + topUp.macros.fiberG,
              }
            : baseTotals;
          const dayDishes = [...MEAL_TYPES.map((type) => plan[type][i]), ...(topUp ? [topUp] : [])];
          const { present, fruitServings } = detectFoodGroups(dayDishes);
          const energyGood = totals.kcal >= targets.energyKcal * 0.9;
          const proteinGood = totals.proteinG >= targets.proteinG;
          const fibreGood = totals.fiberG >= targets.fiberMinG;
          const fruitGood = fruitServings > 0;

          const suggestion = !energyGood
            ? "Even with an added fruit & nuts top-up, this day falls short of your estimated energy need — consider a larger top-up or portions than shown."
            : !fruitGood
              ? "One simple improvement: add a serving of fruit today."
              : !fibreGood
                ? "One simple improvement: add a fibre-rich side (extra vegetables, or a fruit) today."
                : !present.vegetables
                  ? "One simple improvement: add a vegetable side today."
                  : !proteinGood
                    ? "One simple improvement: add a protein-rich side (dal, curd, or paneer) today."
                    : !present.pulses
                      ? "One simple improvement: add a pulse-based dish (dal, rajma, chana) today."
                      : !present.nutsSeeds
                        ? "One simple improvement: add a small portion of nuts or seeds today."
                        : "Today covers the key food groups and nutrition targets well.";

          return (
            <div key={day}>
              <div className="font-display text-ink text-base font-medium mb-2">{day}</div>

              <div className="rounded-xl border border-line bg-card px-4 py-3 mb-3 text-sm text-ink">
                <div className="font-medium mb-2">Today&apos;s balance</div>
                <div className="flex flex-wrap gap-2">
                  <BalanceItem ok={energyGood} label="Energy" />
                  <BalanceItem ok={proteinGood} label="Protein" />
                  <BalanceItem ok={fibreGood} label="Fibre" />
                  <BalanceItem ok={present.vegetables} label="Vegetables" />
                  <BalanceItem ok={fruitGood} label="Fruit" />
                  <BalanceItem ok={present.pulses} label="Pulses" />
                  <BalanceItem ok={present.nutsSeeds} label="Nuts/seeds" />
                  <BalanceItem ok={present.wholeGrains} label="Whole grains" />
                  <BalanceItem ok={present.dairy} label="Dairy" />
                </div>
                <div className="text-sm mt-2">{suggestion}</div>
              </div>

              <details className="rounded-xl border border-line bg-card px-4 py-3 mb-3 text-sm text-ink">
                <summary className="font-medium cursor-pointer">Nutrition details</summary>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  <span>
                    Energy: {totals.kcal} kcal{" "}
                    <span className="text-muted text-xs">(estimated daily need: ~{targets.energyKcal} kcal)</span>
                  </span>
                  <span>
                    Protein: {totals.proteinG}g{" "}
                    <span className="text-muted text-xs">(your target: ~{targets.proteinG}g, based on your weight)</span>
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
                  not gram-level restriction. Food-group pills above are based on ingredient keywords — a quick
                  variety check, not a nutrient-by-nutrient analysis.
                </div>
                <div className="text-xs mt-1 text-muted">{PERSONAL_TARGETS_SOURCE}</div>
              </details>

              <div className="grid sm:grid-cols-2 gap-3 items-start">
                {MEAL_TYPES.map((type) => {
                  const key = `${i}:${type}`;
                  return (
                    <MealCard
                      key={type}
                      meal={plan[type][i]}
                      selectedConcerns={prefs.concerns}
                      alternatives={getMealOptions(type, prefs.avoidIngredients, customRecipes)}
                      onSwap={(newId) => handleSwap(type, i, newId)}
                      completed={!!completed[key]}
                      onToggleComplete={() => toggleComplete(key)}
                    />
                  );
                })}
              </div>

              {topUp && (
                <div className="mt-3">
                  <MealCard
                    meal={topUp}
                    selectedConcerns={prefs.concerns}
                    completed={!!completed[`${i}:topup`]}
                    onToggleComplete={() => toggleComplete(`${i}:topup`)}
                  />
                </div>
              )}
            </div>
          );
        })}

        <FeedbackWidget context="plan" />
      </div>
    </div>
  );
}
