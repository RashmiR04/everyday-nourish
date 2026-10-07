import { Meal, Preferences, WeekPlan } from "./types";

const PREFS_KEY = "everyday-nourish:preferences";
const PLAN_KEY = "everyday-nourish:plan";
const BABY_STAGE_KEY = "everyday-nourish:babyStage";
const CUSTOM_RECIPES_KEY = "everyday-nourish:customRecipes";

export function savePreferences(prefs: Preferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function loadPreferences(): Preferences | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PREFS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Preferences;
  } catch {
    return null;
  }
}

// Persists the actual resolved plan (including any dish swaps), not just the
// preferences it was generated from — so reloading /plan restores swaps
// instead of silently regenerating a fresh, un-swapped plan. Overwritten
// whenever /plan/new generates a new plan, which is the intended way to
// discard swaps and start over.
export function savePlan(plan: WeekPlan): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function loadPlan(): WeekPlan | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PLAN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WeekPlan;
  } catch {
    return null;
  }
}

// Custom recipes are a standing library the person builds up (not tied to one
// week's plan), so they're stored separately from PLAN_KEY and survive
// regenerating or swapping dishes in a plan.
export function saveCustomRecipes(recipes: Meal[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(recipes));
}

export function loadCustomRecipes(): Meal[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CUSTOM_RECIPES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Meal[];
  } catch {
    return [];
  }
}

export function saveBabyStage(stage: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BABY_STAGE_KEY, stage);
}

export function loadBabyStage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BABY_STAGE_KEY);
}

const VISITED_KEY = "everyday-nourish:hasVisited";

// Checks (and records) whether this browser has been here before. Used only to
// distinguish first-time vs. returning visits in analytics — no identifying
// information is stored or sent anywhere.
export function isReturningVisitor(): boolean {
  if (typeof window === "undefined") return false;
  const seen = window.localStorage.getItem(VISITED_KEY) === "1";
  if (!seen) window.localStorage.setItem(VISITED_KEY, "1");
  return seen;
}

const FEEDBACK_KEY = "everyday-nourish:feedbackGiven";

export function hasGivenFeedback(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(FEEDBACK_KEY) === "1";
}

export function markFeedbackGiven(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEEDBACK_KEY, "1");
}
