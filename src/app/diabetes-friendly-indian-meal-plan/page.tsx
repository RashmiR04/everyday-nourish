import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";

export const metadata: Metadata = {
  title: "Diabetes-Friendly Indian Vegetarian Meal Plan (Free)",
  description:
    "A free, blood-sugar-friendly 7-day Indian vegetarian meal plan — lower-glycemic whole grains and legumes, with sourced nutrition notes. Not a substitute for your doctor's advice.",
};

const SAMPLE_WEEK = [
  { day: "Monday", breakfast: "Vegetable Besan Chilla", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Chana", dinner: "Mushroom Masala with Roti" },
  { day: "Tuesday", breakfast: "Ragi Porridge (Ragi Ganji)", lunch: "Rajma with Brown Rice", snack: "Sprouted Moong Chaat", dinner: "Vegetable Khichdi" },
  { day: "Wednesday", breakfast: "Moong Dal Chilla with Spinach", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Chana", dinner: "Mushroom Masala with Roti" },
  { day: "Thursday", breakfast: "Tofu Bhurji with Roti", lunch: "Rajma with Brown Rice", snack: "Sprouted Moong Chaat", dinner: "Vegetable Khichdi" },
  { day: "Friday", breakfast: "Vegetable Besan Chilla", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Chana", dinner: "Mushroom Masala with Roti" },
  { day: "Saturday", breakfast: "Ragi Porridge (Ragi Ganji)", lunch: "Rajma with Brown Rice", snack: "Sprouted Moong Chaat", dinner: "Vegetable Khichdi" },
  { day: "Sunday", breakfast: "Moong Dal Chilla with Spinach", lunch: "Dal, Roti & Seasonal Sabzi", snack: "Roasted Chana", dinner: "Mushroom Masala with Roti" },
];

export default function DiabetesFriendlyLandingPage() {
  return (
    <SeoLandingPage
      h1="Diabetes-Friendly Indian Vegetarian Meal Plan"
      intro="A free sample week favoring lower-glycemic whole grains and legumes over refined carbohydrates. This describes a dietary pattern, not a treatment — please follow your doctor's or dietitian's specific guidance."
      sampleWeek={SAMPLE_WEEK}
      whyBullets={[
        "Favors lower-glycemic whole grains and legumes (besan, moong dal, ragi, jowar) over refined wheat or white rice.",
        "Pairs protein and fibre at each meal to moderate the blood-sugar response, rather than relying on any single \"diabetic\" ingredient.",
        "Sprouting (as in sprouted moong) lowers starch content compared to the whole legume.",
        "No single food is treated as a fix — the pattern across the week is what matters, consistent with ICMR-NIN dietary guidance.",
      ]}
      ctaNote='Select "Blood sugar / diabetes-friendly" as a health concern when you build your plan, and enter your profile for a personalized energy and protein target.'
      faqs={[
        {
          q: "Will this plan lower my blood sugar?",
          a: "No single meal plan can promise that. This shows a dietary pattern — lower-glycemic grains, fibre, and paired protein — commonly discussed alongside blood-sugar management, not a treatment. Please discuss your specific needs with your doctor or dietitian.",
        },
        {
          q: "Why does the week repeat some dishes?",
          a: "The dataset behind this preference is still growing, so some repetition is expected and shown honestly rather than hidden. Building your own plan also lets you add ingredients you have on hand to nudge variety.",
        },
        {
          q: "Is it free?",
          a: "Yes, no login or payment required — your plan is stored only in your own browser.",
        },
      ]}
    />
  );
}
