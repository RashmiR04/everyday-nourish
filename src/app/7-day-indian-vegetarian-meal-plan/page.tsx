import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "7-Day Indian Vegetarian Meal Plan (Free, Balanced)",
  description:
    "A free, balanced 7-day Indian vegetarian meal plan — breakfast through dinner, with sourced nutrition notes and a grocery list. Personalize it to your own energy and protein needs.",
};

const SAMPLE_WEEK: { day: string; breakfast: string; lunch: string; snack: string; dinner: string }[] = [
  { day: "Monday", breakfast: "Vegetable Besan Chilla", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Chana", dinner: "Methi Thepla with Curd" },
  { day: "Tuesday", breakfast: "Oats & Flaxseed Upma", lunch: "Rajma with Brown Rice", snack: "Fruit with Soaked Almonds", dinner: "Palak Paneer with Roti" },
  { day: "Wednesday", breakfast: "Moong Dal Chilla with Spinach", lunch: "Curd Rice with Pomegranate", snack: "Chia & Curd Bowl", dinner: "Vegetable Khichdi" },
  { day: "Thursday", breakfast: "Tofu Bhurji with Roti", lunch: "Vegetable Pulao with Raita", snack: "Sprouted Moong Chaat", dinner: "Jowar Roti with Lauki Sabzi" },
  { day: "Friday", breakfast: "Ragi Porridge (Ragi Ganji)", lunch: "Soya Chunks Curry with Roti", snack: "Roasted Soy Nuts", dinner: "Mushroom Masala with Roti" },
  { day: "Saturday", breakfast: "Vegetable Besan Chilla", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Peanut Chaat", dinner: "Methi Thepla with Curd" },
  { day: "Sunday", breakfast: "Oats & Flaxseed Upma", lunch: "Rajma with Brown Rice", snack: "Sweet Potato Chaat", dinner: "Palak Paneer with Roti" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this plan suitable for weight loss?",
    a: "This sample week is a balanced, whole-food starting point, not a weight-loss program. If you select \"Weight management\" as a preference when you build your own plan, the plan favors higher-protein, higher-fibre dishes for satiety — but portion needs still vary by person.",
  },
  {
    q: "Can I customize it to my own needs?",
    a: "Yes — this is just a sample week. Building your own plan lets you enter your sex, age, weight, and activity level for an individualized energy and protein estimate, plus optional health-concern preferences (like diabetes-friendly or iron/anemia support) and any ingredients you already have on hand.",
  },
  {
    q: "Is it really free?",
    a: "Yes. There's no login, no payment, and no ads — preferences and your plan are stored only in your own browser.",
  },
  {
    q: "Where do the nutrition numbers come from?",
    a: "Every dish's calories and macros are computed from its actual ingredient list against a nutrition reference table sourced from IFCT 2017 and USDA FoodData Central — not guessed or looked up as a single pre-set number per dish.",
  },
];

export default function SevenDayPlanLandingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink mb-2">7-Day Indian Vegetarian Meal Plan</h1>
        <p className="text-sm text-muted">
          A free, balanced sample week — breakfast through dinner, built from real Indian dishes with sourced
          nutrition notes. This is general information, not medical advice.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-card divide-y divide-line">
        {SAMPLE_WEEK.map((d) => (
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
          <li>Every meal combines a whole grain or legume with vegetables, so the week isn&apos;t carb- or protein-heavy by accident.</li>
          <li>Each dish&apos;s calories and macros are computed from its own ingredients, not a single guessed number.</li>
          <li>You can layer in health-concern preferences (diabetes-friendly, iron/anemia, PCOS-friendly, and more) without changing the balanced foundation.</li>
          <li>An auto-generated grocery list is scaled to your household size once you build your own plan.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-line bg-card px-4 py-3">
        <div className="font-medium text-ink mb-1">Want this personalized to you?</div>
        <p className="text-sm text-muted mb-3">
          Enter your sex, age, weight, and activity level for an individualized energy and protein estimate, plus
          any health concerns or ingredients you already have — free, no login required.
        </p>
        <Link
          href="/plan/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-accent"
        >
          <Sparkles size={16} /> Build your plan
        </Link>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
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
