import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baby complementary feeding plan — Everyday Nourish",
  description:
    "A 6-23 month complementary feeding plan with WHO-aligned age bands, textures, allergen flags, and safety notes for each dish.",
};

export default function BabyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
