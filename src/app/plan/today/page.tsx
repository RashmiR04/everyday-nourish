"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Baby, BookOpen, Clock, Copy, Download, ShoppingBasket, Share2 } from "lucide-react";
import Nav from "@/components/Nav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { MEAL_TYPES, MEAL_TYPE_LABELS, DAYS } from "@/lib/meals";
import { BABY_STAGES } from "@/lib/babyMeals";
import { BABY_ADAPTATION_NOTE, needsBabyCookStep } from "@/lib/babyAdaptation";
import { buildDayGroceryList } from "@/lib/groceryList";
import { loadPreferences, loadPlan } from "@/lib/storage";
import { MealType, Preferences, WeekPlan } from "@/lib/types";
import { track } from "@vercel/analytics";

// Monday = 0 in DAYS/WeekPlan, but JS Date.getDay() is Sunday = 0 — this
// re-indexes so "today" lines up with the right slot in an already-generated
// plan, regardless of which day of the week the plan was built on.
function todayIndex(): number {
  return (new Date().getDay() + 6) % 7;
}

export default function TodayKitchenPage() {
  return (
    <Suspense fallback={null}>
      <KitchenView />
    </Suspense>
  );
}

function KitchenView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [copiedType, setCopiedType] = useState<MealType | null>(null);

  const handleCopy = async (type: MealType, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      track("share_copy_clicked", { mealType: type });
      setTimeout(() => setCopiedType(null), 1500);
    } catch {
      // Clipboard permission denied or unavailable — WhatsApp/Download remain as fallbacks.
    }
  };

  const handleDownload = (name: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    track("share_download_clicked");
  };

  useEffect(() => {
    const loaded = loadPreferences();
    if (!loaded) {
      router.push("/plan/new");
      return;
    }
    const savedPlan = loadPlan();
    if (!savedPlan) {
      router.push("/plan/new");
      return;
    }
    setPrefs(loaded);
    setPlan(savedPlan);
  }, [router]);

  useEffect(() => {
    if (!prefs) return;
    track("today_kitchen_viewed", { hasBaby: prefs.hasBaby, household: prefs.household });
    track("grocery_list_viewed", { scope: "today" });
    MEAL_TYPES.forEach((type) => track("meal_viewed", { mealType: type }));
    if (prefs.hasBaby) track("family_adaptation_viewed", { babyStage: prefs.babyStage });
    // Deliberately runs once when prefs first loads, not on every prefs change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!prefs]);

  if (!prefs || !plan) return null;

  // Number(null) is 0, not NaN — so a missing "day" param must be checked for
  // explicitly, otherwise a plain /plan/today link (no query string) would
  // silently resolve to day 0 (Monday) instead of falling back to today's
  // actual date.
  const dayParamRaw = searchParams.get("day");
  const dayParam = dayParamRaw !== null ? Number(dayParamRaw) : NaN;
  const hasValidDayParam = !Number.isNaN(dayParam) && dayParam >= 0 && dayParam <= 6;
  const dayIndex = hasValidDayParam ? dayParam : todayIndex();
  const isViewingToday = dayIndex === todayIndex();
  const dayMeals = MEAL_TYPES.map((type) => plan[type][dayIndex]);
  const babyStageLabel =
    prefs.hasBaby && prefs.babyStage
      ? (BABY_STAGES.find((s) => s.id === prefs.babyStage)?.label.split(" (")[0] ?? null)
      : null;
  const needsBabyStep = prefs.hasBaby && !!prefs.babyStage && needsBabyCookStep(prefs.babyStage);
  const { needToBuy, alreadyHave } = buildDayGroceryList(dayMeals, prefs.household, prefs.ingredientsOnHand);

  return (
    <div>
      <Nav />
      <div className="space-y-6">
        <DisclaimerBanner />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">
              {DAYS[dayIndex]}
              {isViewingToday ? " · Today" : ""}
            </div>
            <h2 className="font-display text-ink text-xl font-semibold">
              {isViewingToday ? "Today's Kitchen" : `${DAYS[dayIndex]}'s Kitchen`}
            </h2>
          </div>
          <Link href="/plan" className="text-sm text-accentDeep underline">
            See full week
          </Link>
        </div>

        <div className="text-sm text-ink flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full border border-line">
            Cooking for {prefs.household} {prefs.household === 1 ? "person" : "people"}
          </span>
          {prefs.hasBaby && (
            <span className="px-2.5 py-1 rounded-full border border-line flex items-center gap-1">
              <Baby size={14} className="text-accentDeep" /> + baby ({babyStageLabel})
            </span>
          )}
        </div>

        <div className="space-y-3">
          {MEAL_TYPES.map((type: MealType) => {
            const meal = plan[type][dayIndex];
            const onHandMatches = meal.ingredients
              .filter((ing) => prefs.ingredientsOnHand.some((h) => ing.name.toLowerCase().includes(h.toLowerCase())))
              .map((ing) => ing.name);
            const canShare = prefs.cookingSetup === "helper" || prefs.cookingSetup === "varies";
            const shareText = [
              `${DAYS[dayIndex]} – ${MEAL_TYPE_LABELS[type]}`,
              "",
              meal.name,
              "",
              ...meal.recipeSteps.map((s, i) => `${i + 1}. ${s}`),
              ...(needsBabyStep
                ? [
                    "",
                    "Baby:",
                    "- Set aside a portion before adding chilli/extra spices",
                    "- No added salt",
                    "- Soft/mashed texture",
                  ]
                : []),
            ].join("\n");

            return (
              <div key={type} className="rounded-xl border border-line bg-card px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted">{MEAL_TYPE_LABELS[type]}</div>
                <div className="font-medium text-ink">{meal.name}</div>
                <div className="text-xs text-muted mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {meal.cookTimeMinutes} min
                  </span>
                  <span>{meal.servingSize}</span>
                  <span>{meal.caloriesPerServing} kcal</span>
                </div>

                <div className="text-sm text-ink mt-2 space-y-1">
                  {prefs.hasBaby && prefs.babyStage && (
                    <div>
                      <span className="text-muted">👶 Baby ({babyStageLabel}): </span>
                      {BABY_ADAPTATION_NOTE[prefs.babyStage]}
                    </div>
                  )}
                  {onHandMatches.length > 0 && (
                    <div>
                      <span className="text-muted">Already have: </span>
                      {onHandMatches.join(", ")}
                    </div>
                  )}
                </div>

                <details
                  className="mt-3 text-sm text-ink"
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open) track("cook_instructions_viewed", { mealType: type });
                  }}
                >
                  <summary className="font-medium cursor-pointer flex items-center gap-1.5 text-accentDeep">
                    <BookOpen size={14} /> View recipe
                  </summary>
                  <div className="mt-2">
                    <div className="font-medium mb-1 text-muted text-xs">Ingredients</div>
                    <ul className="space-y-0.5">
                      {meal.ingredients.map((ing) => (
                        <li key={ing.name}>
                          {ing.name} — {ing.qty}
                        </li>
                      ))}
                    </ul>
                    <div className="font-medium mb-1 mt-2 text-muted text-xs">Steps</div>
                    <ol className="list-decimal list-inside space-y-0.5">
                      {meal.recipeSteps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                    {needsBabyStep && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-tagBg text-tagText text-xs">
                        👶 Before adding chilli or extra spices: set aside a small portion for the baby.
                      </div>
                    )}
                    {canShare && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <button
                          onClick={() => handleCopy(type, shareText)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-line text-ink"
                        >
                          <Copy size={12} /> {copiedType === type ? "Copied!" : "Copy"}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track("send_to_cook_clicked", { mealType: type })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-line text-ink"
                        >
                          <Share2 size={12} /> WhatsApp
                        </a>
                        <button
                          onClick={() => handleDownload(meal.name, shareText)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-line text-ink"
                        >
                          <Download size={12} /> Download
                        </button>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-line bg-card px-4 py-3">
          <div className="font-medium mb-2 flex items-center gap-1.5 text-ink">
            <ShoppingBasket size={16} className="text-accentDeep" /> For {isViewingToday ? "today" : DAYS[dayIndex]}
          </div>
          {needToBuy.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-muted mb-1">You need to buy</div>
              <ul className="text-sm text-ink space-y-0.5">
                {needToBuy.map((item) => (
                  <li key={item.name}>
                    • {item.name} — {item.display}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {alreadyHave.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted mb-1">Already at home</div>
              <ul className="text-sm text-muted space-y-0.5">
                {alreadyHave.map((item) => (
                  <li key={item.name}>• {item.name}</li>
                ))}
              </ul>
            </div>
          )}
          {needToBuy.length === 0 && alreadyHave.length === 0 && (
            <div className="text-sm text-muted">No ingredients to list for today.</div>
          )}
        </div>

        <Link href="/plan/grocery-list" className="text-sm text-accentDeep underline block">
          See full week&apos;s grocery list
        </Link>
      </div>
    </div>
  );
}
