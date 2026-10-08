import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { buildSampleWeek } from "@/lib/seoSampleWeek";

export const metadata: Metadata = {
  title: "Iron-Rich Indian Vegetarian Diet Plan for Anemia (Free)",
  description:
    "A free sample 7-day Indian vegetarian meal plan featuring iron-rich plant foods paired with vitamin C for better absorption. General information, not medical advice.",
};

export default function IronRichLandingPage() {
  return (
    <SeoLandingPage
      h1="Iron-Rich Indian Vegetarian Diet Plan"
      intro="A free sample week built around plant-based iron sources (spinach, rajma, chana, soya) paired with vitamin C in the same meal to aid absorption. General information, not medical advice for diagnosed anemia."
      sampleWeek={buildSampleWeek(["iron"])}
      whyBullets={[
        "Spinach, rajma, chana, and soya chunks all contribute non-heme (plant-based) iron through the week.",
        "Vitamin C sources (tomato in the same dish, for example) are paired with iron-rich ingredients in the same meal, since vitamin C helps the body absorb non-heme iron.",
        "Paneer and curd add protein and calcium alongside the iron-focused dishes, so the week isn't iron at the expense of everything else.",
        "This is a dietary pattern, not a treatment for diagnosed anemia — please follow your doctor's specific guidance and any prescribed supplementation.",
      ]}
      ctaNote='Select "Iron / anemia" as a health concern when you build your plan, and enter your profile for a personalized energy and protein target.'
      faqs={[
        {
          q: "Can diet alone fix my iron deficiency?",
          a: "Not necessarily — diagnosed anemia often needs medical evaluation and sometimes supplementation. This plan shows a helpful dietary pattern (iron paired with vitamin C) to discuss with your doctor, not a replacement for their guidance.",
        },
        {
          q: "Why does this week repeat quite a bit?",
          a: "Honestly: only a few dishes in the current dataset are specifically tagged for iron, so this sample week repeats more than we'd like. The dataset is actively growing, and building your own plan lets you add ingredients on hand for some variety.",
        },
        {
          q: "Is it free?",
          a: "Yes, no login or payment required.",
        },
      ]}
    />
  );
}
