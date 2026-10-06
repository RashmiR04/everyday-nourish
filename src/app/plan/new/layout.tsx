import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build your plan — Everyday Nourish",
  description:
    "Tell us your health concerns, ingredients on hand, and household size — get a sourced, balanced 7-day Indian meal plan.",
};

export default function NewPlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
