import Link from "next/link";
import { Sparkles } from "lucide-react";

export interface SampleDay {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

export interface Faq {
  q: string;
  a: string;
}

export default function SeoLandingPage({
  h1,
  intro,
  sampleWeek,
  whyBullets,
  ctaNote,
  faqs,
}: {
  h1: string;
  intro: string;
  sampleWeek: SampleDay[];
  whyBullets: string[];
  ctaNote: string;
  faqs: Faq[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink mb-2">{h1}</h1>
        <p className="text-sm text-muted">{intro}</p>
      </div>

      <div className="rounded-xl border border-line bg-card shadow-sm hover:shadow-md transition-shadow duration-200 divide-y divide-line">
        {sampleWeek.map((d) => (
          <div key={d.day} className="px-4 py-3 text-sm text-ink">
            <div className="font-medium mb-1">{d.day}</div>
            <div className="text-muted">
              Breakfast: {d.breakfast} · Lunch: {d.lunch} · Snack: {d.snack} · Dinner: {d.dinner}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg text-ink mb-2">Why this plan works</h2>
        <ul className="list-disc list-inside text-sm text-ink space-y-1">
          {whyBullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-line bg-card shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3">
        <div className="font-medium text-ink mb-1">Want this personalized to you?</div>
        <p className="text-sm text-muted mb-3">{ctaNote}</p>
        <Link
          href="/plan/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent hover:bg-accentDeep transition-colors"
        >
          <Sparkles size={16} /> Build your plan
        </Link>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q}>
              <div className="font-medium text-sm text-ink mb-1">{f.q}</div>
              <p className="text-sm text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
