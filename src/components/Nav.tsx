"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const isBaby = pathname.startsWith("/baby");

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Leaf size={20} className="text-accentDeep" />
        <span className="text-xs uppercase tracking-wide text-muted">Everyday Nourish</span>
      </div>
      <h1 className="font-display text-ink text-2xl font-semibold mb-3">Your week, sorted.</h1>
      <div className="flex gap-2">
        <Link
          href="/plan/new"
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${
            !isBaby ? "bg-accent border-accent text-white" : "border-line text-ink"
          }`}
        >
          My plan
        </Link>
        <Link
          href="/baby"
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${
            isBaby ? "bg-accent border-accent text-white" : "border-line text-ink"
          }`}
        >
          Baby&apos;s plan
        </Link>
      </div>
    </div>
  );
}
