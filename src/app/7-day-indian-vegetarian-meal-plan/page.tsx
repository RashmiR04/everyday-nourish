import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";

export const metadata: Metadata = {
  title: "7-Day Indian Vegetarian Meal Plan (Free, Balanced)",
  description:
    "A free, balanced 7-day Indian vegetarian meal plan — breakfast through dinner, with sourced nutrition notes and a grocery list. Personalize it to your own energy and protein needs.",
};

const SAMPLE_WEEK = [
  { day: "Monday", breakfast: "Vegetable Besan Chilla", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Chana", dinner: "Methi Thepla with Curd" },
  { day: "Tuesday", breakfast: "Oats & Flaxseed Upma", lunch: "Rajma with Brown Rice", snack: "Fruit with Soaked Almonds", dinner: "Palak Paneer with Roti" },
  { day: "Wednesday", breakfast: "Moong Dal Chilla with Spinach", lunch: "Curd Rice with Pomegranate", snack: "Chia & Curd Bowl", dinner: "Vegetable Khichdi" },
  { day: "Thursday", breakfast: "Tofu Bhurji with Roti", lunch: "Vegetable Pulao with Raita", snack: "Sprouted Moong Chaat", dinner: "Jowar Roti with Lauki Sabzi" },
  { day: "Friday", breakfast: "Ragi Porridge (Ragi Ganji)", lunch: "Soya Chunks Curry with Roti", snack: "Roasted Soy Nuts", dinner: "Mushroom Masala with Roti" },
  { day: "Saturday", breakfast: "Vegetable Besan Chilla", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Peanut Chaat", dinner: "Methi Thepla with Curd" },
  { day: "Sunday", breakfast: "Oats & Flaxseed Upma", lunch: "Rajma with Brown Rice", snack: "Sweet Potato Chaat", dinner: "Palak Paneer with Roti" },
];

export default function SevenDayPlanLandingPage() {
  return (
    <SeoLandingPage
      h1="7-Day Indian Vegetarian Meal Plan"
      intro="A free, balanced sample week — breakfast through dinner, built from real Indian dishes with sourced nutrition notes. This is general information, not medical advice."
      sampleWeek={SAMPLE_WEEK}
      whyBullets={[
        "Every meal combines a whole grain or legume with vegetables, so the week isn't carb- or protein-heavy by accident.",
        "Each dish's calories and macros are computed from its own ingredients, not a single guessed number.",
        "You can layer in health-concern preferences (diabetes-friendly, iron/anemia, PCOS-friendly, and more) without changing the balanced foundation.",
        "An auto-generated grocery list is scaled to your household size once you build your own plan.",
      ]}
      ctaNote="Enter your sex, age, weight, and activity level for an individualized energy and protein estimate, plus any health concerns or ingredients you already have — free, no login required."
      faqs={[
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
      ]}
    />
  );
}
