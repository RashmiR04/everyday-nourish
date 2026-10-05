"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket, Printer } from "lucide-react";
import Nav from "@/components/Nav";
import { generatePlan } from "@/lib/planner";
import { buildGroceryList } from "@/lib/groceryList";
import { loadPreferences } from "@/lib/storage";
import { Preferences, GroceryItem } from "@/lib/types";

export default function GroceryListPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [grocery, setGrocery] = useState<GroceryItem[] | null>(null);

  useEffect(() => {
    const loaded = loadPreferences();
    if (!loaded) {
      router.push("/plan/new");
      return;
    }
    const plan = generatePlan(loaded.concerns, loaded.ingredientsOnHand);
    setPrefs(loaded);
    setGrocery(buildGroceryList(plan, loaded.household));
  }, [router]);

  if (!prefs || !grocery) return null;

  return (
    <div>
      <Nav />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/plan" className="text-sm text-accentDeep underline">
            Back to plan
          </Link>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm text-accentDeep">
            <Printer size={16} /> Print
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ShoppingBasket size={18} className="text-accentDeep" />
          <span className="text-sm text-muted">
            Scaled for {prefs.household} {prefs.household === 1 ? "person" : "people"}, based on this week&apos;s plan
          </span>
        </div>

        <div className="rounded-xl border border-line bg-card divide-y divide-line">
          {grocery.map((item) => (
            <div key={item.name} className="flex justify-between px-4 py-2.5 text-sm text-ink">
              <span>{item.name}</span>
              <span className="text-muted">{item.display}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
