"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import BabyMealCard from "@/components/BabyMealCard";
import { generateBabyPlan, computeNutrientCoverage } from "@/lib/planner";
import { BABY_STAGES, NUTRIENTS, NUTRIENT_LABELS } from "@/lib/babyMeals";
import { DAYS } from "@/lib/meals";
import { BabyStage } from "@/lib/types";
import { saveBabyStage, loadBabyStage } from "@/lib/storage";

type Step = "stage" | "plan" | "nutrients";

export default function BabyPlanPage() {
  const [step, setStep] = useState<Step>("stage");
  const [stage, setStage] = useState<BabyStage>("6-8m");

  useEffect(() => {
    const saved = loadBabyStage();
    if (saved === "6-8m" || saved === "8-12m") setStage(saved);
  }, []);

  const plan = useMemo(() => generateBabyPlan(stage), [stage]);
  const coverage = useMemo(() => computeNutrientCoverage(plan), [plan]);

  const chooseStage = (s: BabyStage) => {
    setStage(s);
    saveBabyStage(s);
  };

  return (
    <div>
      <Nav />
      <div className="flex gap-2 mb-6">
        {(["stage", "plan", "nutrients"] as Step[]).map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              step === s ? "bg-accentDeep border-accentDeep text-white" : "border-line text-ink"
            }`}
          >
            {i + 1}. {s === "stage" ? "Stage" : s === "plan" ? "Weekly plan" : "Nutrient coverage"}
          </button>
        ))}
      </div>

      {step === "stage" && (
        <div className="space-y-5">
          <div>
            <div className="text-sm font-medium mb-2 text-ink">Which stage is your baby in?</div>
            <div className="flex flex-wrap gap-2">
              {BABY_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => chooseStage(s.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    stage === s.id ? "bg-accent border-accent text-white" : "border-line text-ink"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg px-4 py-3 text-sm bg-tagBg text-tagText">
            <div className="font-medium mb-1">General safety reminders for this age</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>No honey before 12 months</li>
              <li>No added salt or sugar in baby&apos;s food</li>
              <li>No whole nuts or hard raw pieces — pastes or well-mashed only</li>
              <li>Introduce one new potential allergen at a time, in a small amount, and watch for a reaction over a few days</li>
              <li>This is general information, not a substitute for your pediatrician&apos;s guidance for your baby specifically</li>
            </ul>
          </div>
          <button
            onClick={() => setStep("plan")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent"
          >
            <Sparkles size={16} /> View this stage&apos;s plan
          </button>
        </div>
      )}

      {step === "plan" && (
        <div className="space-y-3">
          <p className="text-xs mb-2 text-muted">
            Showing one main food focus per day for {BABY_STAGES.find((s) => s.id === stage)?.label.toLowerCase()}.
            Breast milk/formula continues alongside solids at this age.
          </p>
          {DAYS.map((day, i) => (
            <BabyMealCard key={day} meal={plan[i]} dayLabel={day} />
          ))}
        </div>
      )}

      {step === "nutrients" && (
        <div>
          <p className="text-xs mb-4 text-muted">
            How many of the 7 days this week&apos;s plan covers each key nutrient — not a guarantee of your
            baby&apos;s actual intake, just a guide to variety.
          </p>
          <div className="rounded-xl border border-line bg-card divide-y divide-line">
            {NUTRIENTS.map((n) => (
              <div key={n} className="flex items-center justify-between px-4 py-3 text-sm text-ink">
                <span>{NUTRIENT_LABELS[n]}</span>
                <div className="flex items-center gap-3 flex-1 ml-4" style={{ maxWidth: "240px" }}>
                  <div className="flex-1 h-2 rounded-full bg-line">
                    <div className="h-2 rounded-full bg-accentDeep" style={{ width: `${(coverage[n] / 7) * 100}%` }} />
                  </div>
                  <span className="text-muted">{coverage[n]}/7</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
