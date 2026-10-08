"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Meal, ConcernId } from "@/lib/types";
import { MEAL_TYPE_LABELS, CONCERN_TAG_LABELS, MEAL_TYPE_TIMING_NOTE } from "@/lib/meals";
import { getMealPhoto } from "@/lib/mealPhotos";

export default function MealCard({
  meal,
  selectedConcerns,
  alternatives,
  onSwap,
  dayIndex,
  extra,
}: {
  meal: Meal;
  selectedConcerns: ConcernId[];
  alternatives?: Meal[];
  onSwap?: (newDishId: string) => void;
  dayIndex?: number;
  extra?: Meal;
}) {
  const [open, setOpen] = useState(false);
  const relevantTags = meal.concernTags.filter((t) => selectedConcerns.includes(t));

  return (
    <div className="rounded-xl border border-line bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getMealPhoto(meal.name)}
        alt={meal.name}
        className="w-full h-28 object-cover"
        loading="lazy"
      />
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">{MEAL_TYPE_LABELS[meal.mealType]}</div>
          <div className="font-medium text-ink">{meal.name}</div>
          <div className="text-xs mt-1 text-muted min-h-[2.25rem]">
            <div>
              {meal.servingSize} · {meal.caloriesPerServing} kcal
              {meal.portionScale && <span> · ~{meal.portionScale.toFixed(1)}× scaled</span>}
            </div>
            {extra && <div>+ {extra.name}: {extra.caloriesPerServing} kcal</div>}
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
          {onSwap && alternatives && alternatives.length > 1 && (
            <div>
              <label className="font-medium mb-1 text-muted block">Swap this dish</label>
              <select
                value={meal.id}
                onChange={(e) => e.target.value !== meal.id && onSwap(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              >
                {alternatives.map((alt) => (
                  <option key={alt.id} value={alt.id}>
                    {alt.name} ({alt.caloriesPerServing} kcal)
                  </option>
                ))}
              </select>
            </div>
          )}
          {dayIndex !== undefined && (
            <Link
              href={`/plan/today?day=${dayIndex}`}
              className="inline-flex items-center gap-1.5 text-accentDeep font-medium"
            >
              <BookOpen size={14} /> View recipe (ingredients &amp; steps)
            </Link>
          )}
          {extra && (
            <div className="rounded-lg bg-tagBg text-tagText px-3 py-2 text-xs">
              <div className="font-medium mb-0.5">
                Plus: {extra.name} ({extra.servingSize} · {extra.caloriesPerServing} kcal)
              </div>
              <div>{extra.generalNote.note}</div>
            </div>
          )}
          <div>
            <div className="font-medium mb-1 text-muted">
              Nutrients {extra ? "(dish + extra, combined)" : "(per serving)"}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>Protein: {meal.macros.proteinG + (extra?.macros.proteinG ?? 0)}g</span>
              <span>Carbs: {meal.macros.carbsG + (extra?.macros.carbsG ?? 0)}g</span>
              <span>Fat: {Math.round((meal.macros.fatG + (extra?.macros.fatG ?? 0)) * 10) / 10}g</span>
              <span>Fibre: {meal.macros.fiberG + (extra?.macros.fiberG ?? 0)}g</span>
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
