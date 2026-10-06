import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";

export const metadata: Metadata = {
  title: "PCOS-Friendly Indian Vegetarian Diet Plan (Free)",
  description:
    "A free sample Indian vegetarian meal plan favoring higher-protein, lower-refined-carb dishes often discussed alongside PCOS. General information, not medical advice.",
};

const SAMPLE_WEEK = [
  { day: "Monday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Roasted Chana", dinner: "Methi Thepla with Curd" },
  { day: "Tuesday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Sprouted Moong Chaat", dinner: "Methi Thepla with Curd" },
  { day: "Wednesday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Roasted Chana", dinner: "Methi Thepla with Curd" },
  { day: "Thursday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Sprouted Moong Chaat", dinner: "Methi Thepla with Curd" },
  { day: "Friday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Roasted Chana", dinner: "Methi Thepla with Curd" },
  { day: "Saturday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Sprouted Moong Chaat", dinner: "Methi Thepla with Curd" },
  { day: "Sunday", breakfast: "Vegetable Besan Chilla", lunch: "Rajma with Brown Rice", snack: "Roasted Chana", dinner: "Methi Thepla with Curd" },
];

export default function PcosFriendlyLandingPage() {
  return (
    <SeoLandingPage
      h1="PCOS-Friendly Indian Vegetarian Diet Plan"
      intro="A free sample week favoring higher-protein, lower-refined-carb meals — part of general insulin-friendly eating patterns relevant to PCOS, alongside other lifestyle factors. Not a substitute for your doctor's or dietitian's advice."
      sampleWeek={SAMPLE_WEEK}
      whyBullets={[
        "Breakfast and dinner favor high-protein, low-refined-carb dishes (besan, fenugreek) over refined-flour options.",
        "Lunch pairs a legume (rajma) with a whole grain (brown rice) for a complete protein profile and steadier energy.",
        "No single ingredient — including fenugreek — is treated as a fix. Evidence on specific \"superfoods\" for PCOS is mixed; exercise, sleep, and medical care matter alongside diet.",
        "The underlying app layers this pattern on top of a balanced plan rather than replacing it.",
      ]}
      ctaNote='Select "PCOS-friendly" as a health concern when you build your plan, and enter your profile for a personalized energy and protein target.'
      faqs={[
        {
          q: "Will this diet help my PCOS symptoms?",
          a: "This shows a commonly-discussed dietary pattern (higher protein, lower refined carbs), not a treatment, and it can't promise symptom changes. PCOS management typically involves your doctor or dietitian alongside diet and lifestyle factors.",
        },
        {
          q: "Why only two dishes repeating so much?",
          a: "Honestly: the dataset behind this specific preference is still small, so this sample week repeats more than we'd like. Building your own plan lets you add ingredients on hand to nudge some variety, and the dataset is actively growing.",
        },
        {
          q: "Is it free?",
          a: "Yes, no login or payment required.",
        },
      ]}
    />
  );
}
