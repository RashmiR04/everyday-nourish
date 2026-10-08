"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BabyMeal } from "@/lib/types";
import { NUTRIENT_LABELS } from "@/lib/babyMeals";

export default function BabyMealCard({ meal, dayLabel }: { meal: BabyMeal; dayLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">
            {dayLabel} · {meal.texture} · {meal.caloriesPerServing != null ? `${meal.caloriesPerServing} kcal` : "kcal pending verification"}
          </div>
          <div className="font-medium text-ink">{meal.name}</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {meal.nutrientsCovered.map((n) => (
              <span key={n} className="text-xs px-2 py-0.5 rounded-full bg-tagBg text-tagText">
                {NUTRIENT_LABELS[n]}
              </span>
            ))}
            {meal.allergenFlags.map((a) => (
              <span key={a} className="text-xs px-2 py-0.5 rounded-full border border-accent text-accent">
                Contains: {a}
              </span>
            ))}
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-muted shrink-0" /> : <ChevronDown size={18} className="text-muted shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 text-sm text-ink">
          <div>
            <div className="font-medium mb-1 text-muted">Ingredients</div>
            <ul className="space-y-0.5">
              {meal.ingredients.map((ing) => (
                <li key={ing.name}>
                  {ing.name} — {ing.qty}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium mb-1 text-muted">Steps</div>
            <ol className="list-decimal list-inside space-y-0.5">
              {meal.recipeSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
          <div>
            <div className="font-medium mb-1 text-muted">Why it&apos;s suggested</div>
            <ul className="space-y-2">
              {meal.nutrientsCovered.map((n) => {
                const info = meal.nutrientNotes[n];
                if (!info) return null;
                return (
                  <li key={n}>
                    <div>{info.note}</div>
                    <div className="text-xs mt-0.5 text-muted">Source: {info.source}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-lg px-3 py-2 bg-tagBg">
            <div className="font-medium mb-1 text-tagText">Safety notes</div>
            <ul className="list-disc list-inside space-y-0.5 text-tagText">
              {meal.safetyNotes.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
