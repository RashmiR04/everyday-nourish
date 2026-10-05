"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { CONCERNS } from "@/lib/meals";
import { ConcernId, Preferences } from "@/lib/types";
import { savePreferences } from "@/lib/storage";

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        active ? "bg-accent border-accent text-white" : "border-line text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function NewPlanPage() {
  const router = useRouter();
  const [selectedConcerns, setSelectedConcerns] = useState<ConcernId[]>([]);
  const [household, setHousehold] = useState(2);
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientsOnHand, setIngredientsOnHand] = useState<string[]>([]);

  const toggleConcern = (id: ConcernId) => {
    setSelectedConcerns((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (val && !ingredientsOnHand.includes(val)) {
      setIngredientsOnHand([...ingredientsOnHand, val]);
    }
    setIngredientInput("");
  };

  const buildPlan = () => {
    const prefs: Preferences = { concerns: selectedConcerns, ingredientsOnHand, household };
    savePreferences(prefs);
    router.push("/plan");
  };

  return (
    <div>
      <Nav />
      <div className="space-y-6">
        <DisclaimerBanner />

        <div>
          <div className="text-sm font-medium mb-2 text-ink">
            Any health concerns on your mind? (optional, pick any number)
          </div>
          <div className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <Pill key={c.id} active={selectedConcerns.includes(c.id)} onClick={() => toggleConcern(c.id)}>
                {c.label}
              </Pill>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2 text-ink">
            Have an ingredient on hand? We&apos;ll prioritize dishes that use it.
          </div>
          <div className="flex gap-2">
            <input
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIngredient()}
              placeholder="e.g. paneer"
              className="flex-1 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
            />
            <button onClick={addIngredient} className="px-4 py-2 rounded-lg text-sm text-white bg-accentDeep">
              Add
            </button>
          </div>
          {ingredientsOnHand.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {ingredientsOnHand.map((ing) => (
                <span key={ing} className="text-xs px-2 py-1 rounded-full flex items-center gap-1 bg-tagBg text-tagText">
                  {ing}
                  <X size={12} className="cursor-pointer" onClick={() => setIngredientsOnHand(ingredientsOnHand.filter((i) => i !== ing))} />
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium mb-2 text-ink">Cooking for how many people?</div>
          <input
            type="number"
            min={1}
            value={household}
            onChange={(e) => setHousehold(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
          />
        </div>

        <button
          onClick={buildPlan}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent"
        >
          <Sparkles size={16} /> Build my plan
        </button>
      </div>
    </div>
  );
}
