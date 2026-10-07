import { track as vercelTrack } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";

type EventProps = Record<string, string | number | boolean | null | undefined>;

// Fires custom events to both Vercel Analytics and Google Analytics (GA4).
// Vercel's free Hobby plan shows page views but gates the "Events" view
// (custom events) behind a paid Pro plan — GA4 has no such restriction, so
// routing every custom event there too is what actually makes this data
// visible without paying for an upgrade. Keeping the Vercel call as well
// costs nothing and means the data is already flowing if the plan ever
// changes.
//
// Uses sendGAEvent (the documented @next/third-parties helper) rather than
// calling a hand-guessed window.gtag — that global isn't part of this
// package's public contract (its own types only declare window.dataLayer),
// so relying on it directly was the likely reason events weren't appearing.
export function track(name: string, props?: EventProps): void {
  vercelTrack(name, props);
  sendGAEvent("event", name, props ?? {});
}
