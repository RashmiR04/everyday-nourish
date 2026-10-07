import { track as vercelTrack } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fires custom events to both Vercel Analytics and Google Analytics (GA4).
// Vercel's free Hobby plan shows page views but gates the "Events" view
// (custom events) behind a paid Pro plan — GA4 has no such restriction, so
// routing every custom event there too is what actually makes this data
// visible without paying for an upgrade. Keeping the Vercel call as well
// costs nothing and means the data is already flowing if the plan ever
// changes.
export function track(name: string, props?: EventProps): void {
  vercelTrack(name, props);
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, props ?? {});
  }
}
