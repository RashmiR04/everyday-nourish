import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { buildSampleWeek } from "@/lib/seoSampleWeek";

export const metadata: Metadata = {
  title: "PCOS-Friendly Indian Vegetarian Diet Plan (Free)",
  description:
    "A free sample Indian vegetarian meal plan favoring higher-protein, lower-refined-carb dishes often discussed alongside PCOS. General information, not medical advice.",
};

export default function PcosFriendlyLandingPage() {
  return (
    <SeoLandingPage
      h1="PCOS-Friendly Indian Vegetarian Diet Plan"
      intro="A free sample week favoring higher-protein, lower-refined-carb meals — part of general insulin-friendly eating patterns relevant to PCOS, alongside other lifestyle factors. Not a substitute for your doctor's or dietitian's advice."
      sampleWeek={buildSampleWeek(["pcos"])}
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
          q: "Why does this look similar to the general plan?",
          a: "Honestly: only a couple of dishes in the current dataset are specifically tagged for this pattern, so selecting it doesn't change much yet — the general plan is already a reasonably balanced, higher-protein starting point. We're actively tagging more dishes for this preference.",
        },
        {
          q: "Is it free?",
          a: "Yes, no login or payment required.",
        },
      ]}
    />
  );
}
