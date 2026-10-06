import { Preferences } from "./types";

const PREFS_KEY = "everyday-nourish:preferences";
const BABY_STAGE_KEY = "everyday-nourish:babyStage";

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
