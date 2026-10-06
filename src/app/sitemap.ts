import type { MetadataRoute } from "next";

const SITE_URL = "https://everyday-nourish.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // /plan and /plan/grocery-list depend on a saved profile and redirect to
  // /plan/new otherwise, so only the real entry points are listed here.
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/plan/new`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/baby`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/7-day-indian-vegetarian-meal-plan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/diabetes-friendly-indian-meal-plan`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/pcos-friendly-indian-diet-plan`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/iron-rich-indian-vegetarian-diet`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
