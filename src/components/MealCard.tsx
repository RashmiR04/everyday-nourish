"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Meal, ConcernId } from "@/lib/types";
import { MEAL_TYPE_LABELS, CONCERN_TAG_LABELS, MEAL_TYPE_TIMING_NOTE } from "@/lib/meals";

export default function MealCard({
  meal,
  selectedConcerns,
}: {
  meal: Meal;
  selectedConcerns: ConcernId[];
}) {
  const [open, setOpen] = useState(false);
  const relevantTags = meal.concernTags.filter((t) => selectedConcerns.includes(t));

  return (
    <div className="rounded-xl border border-line bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">{MEAL_TYPE_LABELS[meal.mealType]}</div>
          <div className="font-medium text-ink">{meal.name}</div>
          <div className="text-xs mt-1 text-muted">
            {meal.servingSize} · {meal.caloriesPerServing} kcal
          </div>
          {relevantTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {relevantTags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-tagBg text-tagText">
                  {CONCERN_TAG_LABELS[tag]}
                </span>
              ))}
            </div>
          )}
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
            <div className="font-medium mb-1 text-muted">Nutrients (per serving)</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>Protein: {meal.macros.proteinG}g</span>
              <span>Carbs: {meal.macros.carbsG}g</span>
              <span>Fat: {meal.macros.fatG}g</span>
              <span>Fibre: {meal.macros.fiberG}g</span>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1 text-muted">Why it&apos;s suggested</div>
            <ul className="space-y-2">
              <li>
                <div>{meal.generalNote.note}</div>
                <div className="text-xs mt-0.5 text-muted">Source: {meal.generalNote.source}</div>
              </li>
              {relevantTags.map((tag) => {
                const info = meal.concernNotes[tag];
                if (!info) return null;
                return (
                  <li key={tag}>
                    <div>{info.note}</div>
                    <div className="text-xs mt-0.5 text-muted">Source: {info.source}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <div className="font-medium mb-1 text-muted">Why {MEAL_TYPE_LABELS[meal.mealType].toLowerCase()}</div>
            <div>{MEAL_TYPE_TIMING_NOTE[meal.mealType]}</div>
          </div>
        </div>
      )}
    </div>
  );
}
