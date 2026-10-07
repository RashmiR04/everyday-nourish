"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ChefHat } from "lucide-react";
import Nav from "@/components/Nav";
import { MEAL_TYPES, MEAL_TYPE_LABELS } from "@/lib/meals";
import { INGREDIENT_NAMES, PER_PIECE_INGREDIENTS, computeNutritionFromIngredients } from "@/lib/ingredientNutrition";
import { buildCustomMeal } from "@/lib/customRecipes";
import { loadCustomRecipes, saveCustomRecipes } from "@/lib/storage";
import { Ingredient, Meal, MealType } from "@/lib/types";
import { track } from "@vercel/analytics";

type Unit = "g" | "ml" | "piece";

interface Row {
  name: string;
  amount: string;
  unit: Unit;
}

function unitsFor(ingredientName: string): Unit[] {
  return PER_PIECE_INGREDIENTS.includes(ingredientName) ? ["piece"] : ["g", "ml"];
}

function emptyRow(): Row {
  const name = INGREDIENT_NAMES[0];
  return { name, amount: "", unit: unitsFor(name)[0] };
}

function rowsToIngredients(rows: Row[]): Ingredient[] {
  return rows
    .filter((r) => r.name && parseFloat(r.amount) > 0)
    .map((r) => ({
      name: r.name,
      qty: r.unit === "piece" ? `${r.amount} pieces` : `${r.amount}${r.unit}`,
    }));
}

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [servingSize, setServingSize] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [rows, setRows] = useState<Row[]>([emptyRow()]);

  useEffect(() => {
    setRecipes(loadCustomRecipes());
  }, []);

  const ingredients = rowsToIngredients(rows);
  const preview = ingredients.length > 0 ? computeNutritionFromIngredients(ingredients) : null;

  const updateRow = (i: number, patch: Partial<Row>) => {
    setRows((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        const next = { ...r, ...patch };
        if (patch.name) {
          const valid = unitsFor(patch.name);
          if (!valid.includes(next.unit)) next.unit = valid[0];
        }
        return next;
      })
    );
  };

  const resetForm = () => {
    setName("");
    setMealType("lunch");
    setServingSize("");
    setStepsText("");
    setRows([emptyRow()]);
    setShowForm(false);
  };

  const canSave = name.trim().length > 0 && ingredients.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const meal = buildCustomMeal({
      name: name.trim(),
      mealType,
      servingSize,
      ingredients,
      recipeSteps: stepsText.split("\n"),
    });
    const updated = [...recipes, meal];
    setRecipes(updated);
    saveCustomRecipes(updated);
    track("custom_recipe_added", { mealType, ingredientCount: ingredients.length });
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = recipes.filter((r) => r.id !== id);
    setRecipes(updated);
    saveCustomRecipes(updated);
  };

  return (
    <div>
      <Nav />
      <div className="space-y-6">
        <div className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink">
          <div className="font-medium mb-1 flex items-center gap-1.5">
            <ChefHat size={16} className="text-accentDeep" /> Build a dish from known ingredients
          </div>
          <div className="text-muted">
            Pick ingredients and quantities from the same list every dish in this app uses, so your own recipe gets
            real calculated calories and nutrients too — and can be swapped into any day of your plan.
          </div>
        </div>

        {recipes.length > 0 && (
          <div className="rounded-xl border border-line bg-card divide-y divide-line">
            {recipes.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted">{MEAL_TYPE_LABELS[r.mealType]}</div>
                  <div className="font-medium text-ink">{r.name}</div>
                  <div className="text-xs mt-1 text-muted">
                    {r.servingSize} · {r.caloriesPerServing} kcal · P {r.macros.proteinG}g · C {r.macros.carbsG}g · F{" "}
                    {r.macros.fatG}g · Fibre {r.macros.fiberG}g
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id)} className="text-muted shrink-0" aria-label={`Delete ${r.name}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent"
          >
            <Plus size={16} /> Add a recipe
          </button>
        ) : (
          <div className="rounded-xl border border-line bg-card px-4 py-4 space-y-4 text-sm text-ink">
            <div>
              <label className="block text-xs mb-1 text-muted">Dish name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amma's special dal"
                className="w-full px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-muted">Meal type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
                >
                  {MEAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {MEAL_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 text-muted">Serving size (e.g. 1 bowl)</label>
                <input
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  placeholder="1 bowl"
                  className="w-full px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-2 text-muted">Ingredients</label>
              <div className="space-y-2">
                {rows.map((row, i) => {
                  const options = unitsFor(row.name);
                  return (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={row.name}
                        onChange={(e) => updateRow(i, { name: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
                      >
                        {INGREDIENT_NAMES.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={0}
                        value={row.amount}
                        onChange={(e) => updateRow(i, { amount: e.target.value })}
                        placeholder="0"
                        className="w-20 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
                      />
                      {options.length > 1 ? (
                        <select
                          value={row.unit}
                          onChange={(e) => updateRow(i, { unit: e.target.value as Unit })}
                          className="px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
                        >
                          {options.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-muted w-14">pieces</span>
                      )}
                      <button
                        onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                        disabled={rows.length === 1}
                        className="text-muted disabled:opacity-30"
                        aria-label="Remove ingredient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setRows([...rows, emptyRow()])}
                className="text-sm text-accentDeep underline mt-2"
              >
                + Add another ingredient
              </button>
            </div>

            {preview && (
              <div className="text-xs text-muted">
                So far: {preview.caloriesPerServing} kcal · P {preview.macros.proteinG}g · C {preview.macros.carbsG}g
                · F {preview.macros.fatG}g · Fibre {preview.macros.fiberG}g
              </div>
            )}

            <div>
              <label className="block text-xs mb-1 text-muted">Steps (optional, one per line)</label>
              <textarea
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                rows={3}
                placeholder={"Boil the dal until soft\nAdd the tempering and mix well"}
                className="w-full px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent disabled:opacity-40"
              >
                Save recipe
              </button>
              <button onClick={resetForm} className="px-5 py-2.5 rounded-lg text-sm font-medium text-ink border border-line">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
