import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Everyday Nourish</h1>
        <p className="text-muted">
          A practical Indian meal planner — balanced by default. Tell it what&apos;s on your mind,
          and it adjusts, with real sources instead of vague advice.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-card p-5 space-y-3">
        <h2 className="font-display text-lg text-ink">What you get</h2>
        <ul className="text-sm text-ink space-y-1.5 list-disc list-inside">
          <li>A 7-day vegetarian meal plan, breakfast through dinner</li>
          <li>Optional: tell it any health concerns, and it prioritizes dishes that help — layered on top of a balanced plan, not instead of it</li>
          <li>Have an ingredient on hand? It nudges that into your week</li>
          <li>Every suggested dish explains why, with a real source you can check</li>
          <li>An auto-generated grocery list, scaled to your household size</li>
          <li>A separate mode for your baby&apos;s complementary feeding (6-12 months)</li>
        </ul>
      </div>

      <Link
        href="/plan/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent"
      >
        <Sparkles size={16} /> Build my plan
      </Link>
    </div>
  );
}
