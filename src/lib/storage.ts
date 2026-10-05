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
