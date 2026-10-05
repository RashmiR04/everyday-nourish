import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Everyday Nourish",
  description: "A practical Indian meal planner — balanced by default, tailored to what matters to you.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">{children}</div>
      </body>
    </html>
  );
}
