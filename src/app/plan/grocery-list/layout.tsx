import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grocery list — Everyday Nourish",
  description: "An auto-generated grocery list from your weekly meal plan, scaled to your household size.",
};

export default function GroceryListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
