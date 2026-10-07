"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { CONCERNS, CONCERN_TAG_LABELS, CONCERN_PATTERN_GUIDANCE, CONCERN_PATTERN_DISCLAIMER } from "@/lib/meals";
import { BABY_STAGES } from "@/lib/babyMeals";
import { ActivityLevel, BabyStage, ConcernId, Preferences, Sex } from "@/lib/types";
import { savePreferences, savePlan, clearDayNotes } from "@/lib/storage";
import { ACTIVITY_LABELS, computePersonalTargets } from "@/lib/nutritionTargets";
import { generatePlan } from "@/lib/planner";
import { track } from "@vercel/analytics";

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
  const [avoidInput, setAvoidInput] = useState("");
  const [avoidIngredients, setAvoidIngredients] = useState<string[]>([]);
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(60);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("sedentary");
  const [hasBaby, setHasBaby] = useState(false);
  const [babyStage, setBabyStage] = useState<BabyStage>("6-8m");

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

  const addAvoid = () => {
    const val = avoidInput.trim();
    if (val && !avoidIngredients.includes(val)) {
      setAvoidIngredients([...avoidIngredients, val]);
    }
    setAvoidInput("");
  };

  const buildPlan = () => {
    const prefs: Preferences = {
      concerns: selectedConcerns,
      ingredientsOnHand,
      avoidIngredients,
      household: Math.max(1, household || 1),
      sex,
      age: Math.min(100, Math.max(18, age || 18)),
      weightKg: Math.min(200, Math.max(30, weightKg || 30)),
      activityLevel,
      hasBaby,
      babyStage: hasBaby ? babyStage : undefined,
    };
    savePreferences(prefs);
    const targets = computePersonalTargets(prefs.sex, prefs.age, prefs.weightKg, prefs.activityLevel);
    savePlan(generatePlan(prefs.concerns, prefs.ingredientsOnHand, targets.energyKcal, prefs.avoidIngredients));
    clearDayNotes();
    track("plan_generated", {
      concernCount: selectedConcerns.length,
      hasIngredientsOnHand: ingredientsOnHand.length > 0,
      household,
      hasBaby,
    });
    router.push("/plan/today");
  };

  return (
    <div>
      <Nav />
      <div className="space-y-6">
        <DisclaimerBanner />

        <div>
          <div className="text-sm font-medium mb-2 text-ink">
            About you — used to estimate your daily nutrition targets
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs mb-1 text-muted">Sex</label>
              <div className="flex gap-2">
                <Pill active={sex === "female"} onClick={() => setSex("female")}>
                  Female
                </Pill>
                <Pill active={sex === "male"} onClick={() => setSex("male")}>
                  Male
                </Pill>
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1 text-muted">Age</label>
              <input
                type="number"
                min={18}
                max={100}
                value={age === 0 ? "" : age}
                onChange={(e) => setAge(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                onBlur={() => setAge((a) => Math.min(100, Math.max(18, a || 18)))}
                className="w-20 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-muted">Weight (kg)</label>
              <input
                type="number"
                min={30}
                max={200}
                value={weightKg === 0 ? "" : weightKg}
                onChange={(e) => setWeightKg(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                onBlur={() => setWeightKg((w) => Math.min(200, Math.max(30, w || 30)))}
                className="w-20 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs mb-1 text-muted">Activity level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              >
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                  <option key={level} value={level}>
                    {ACTIVITY_LABELS[level]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs mt-2 text-muted">
            Used only to estimate a general energy/protein reference for your daily summary — not stored anywhere but your browser.
          </div>
        </div>

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

          {selectedConcerns.length > 0 && (
            <div className="rounded-xl border border-line bg-card px-4 py-3 mt-3 text-sm text-ink">
              <div className="font-medium mb-2">How this plan is adapted</div>
              <div className="space-y-2">
                {selectedConcerns.map((c) => (
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
          <div className="text-sm font-medium mb-2 text-ink">
            Any ingredients to avoid? We&apos;ll leave dishes with these out of your plan.
          </div>
          <div className="flex gap-2">
            <input
              value={avoidInput}
              onChange={(e) => setAvoidInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAvoid()}
              placeholder="e.g. mushroom"
              className="flex-1 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
            />
            <button onClick={addAvoid} className="px-4 py-2 rounded-lg text-sm text-white bg-accentDeep">
              Add
            </button>
          </div>
          {avoidIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {avoidIngredients.map((ing) => (
                <span key={ing} className="text-xs px-2 py-1 rounded-full flex items-center gap-1 bg-tagBg text-tagText">
                  {ing}
                  <X size={12} className="cursor-pointer" onClick={() => setAvoidIngredients(avoidIngredients.filter((i) => i !== ing))} />
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
            value={household === 0 ? "" : household}
            onChange={(e) => setHousehold(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
            onBlur={() => setHousehold((h) => Math.max(1, h || 1))}
            className="w-24 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-2 text-ink">Is there a baby in the household?</div>
          <div className="flex flex-wrap gap-2">
            <Pill active={!hasBaby} onClick={() => setHasBaby(false)}>
              No
            </Pill>
            <Pill active={hasBaby} onClick={() => setHasBaby(true)}>
              Yes
            </Pill>
          </div>
          {hasBaby && (
            <div className="mt-3">
              <label className="block text-xs mb-1 text-muted">Baby&apos;s stage</label>
              <div className="flex flex-wrap gap-2">
                {BABY_STAGES.map((s) => (
                  <Pill key={s.id} active={babyStage === s.id} onClick={() => setBabyStage(s.id)}>
                    {s.label}
                  </Pill>
                ))}
              </div>
              <div className="text-xs mt-2 text-muted">
                Used to show how to adapt today&apos;s family meals for your baby — for full baby-specific dishes and
                nutrient coverage, see Baby&apos;s plan separately.
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={buildPlan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent"
          >
            <Sparkles size={16} /> Build my plan
          </button>
          <Link href="/my-recipes" className="text-sm text-accentDeep underline">
            Don&apos;t see a dish you make at home? Add your own recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
