import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your meal plan — Everyday Nourish",
  description:
    "A sourced 7-day Indian meal plan with per-dish nutrients and a daily energy/protein target based on your profile.",
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
