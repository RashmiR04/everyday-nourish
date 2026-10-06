import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const SITE_URL = "https://everyday-nourish.vercel.app";
const SITE_NAME = "Everyday Nourish";
const DESCRIPTION =
  "A practical Indian meal planner — balanced by default. Optional health-concern layering, an ingredient-on-hand nudge, a baby complementary-feeding mode, and sourced nutrition notes instead of vague advice.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — Indian meal planner, balanced by default`,
  description: DESCRIPTION,
  keywords: [
    "Indian meal planner",
    "Indian diet plan",
    "vegetarian meal plan India",
    "baby complementary feeding India",
    "IFCT nutrition",
    "weekly meal plan generator",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Indian meal planner, balanced by default`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Indian meal planner, balanced by default`,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">{children}</div>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-KWZ8KC3WWD" />
    </html>
  );
}
