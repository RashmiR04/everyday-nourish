"use client";

import { useState } from "react";
import { ChefHat, ShoppingBasket, Share2 } from "lucide-react";
import { track } from "@/lib/analytics";

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-card px-4 py-3">
      <div className="font-medium mb-2 flex items-center gap-1.5 text-ink">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

const MEALS = [
  {
    time: "Breakfast",
    dish: "Poha with curd",
    adults: "1 bowl each",
    baby: "Soft-mashed poha, no mustard seeds or chilli, with a spoon of curd",
  },
  {
    time: "Lunch",
    dish: "Lauki chana dal + roti + salad",
    adults: "2 roti + 1 bowl dal + salad each",
    baby: "Mashed dal with a little ghee, no salt, soft roti pieces, no raw salad",
  },
  {
    time: "Dinner",
    dish: "Paneer bhurji + roti + cucumber",
    adults: "2 roti + bhurji + cucumber each",
    baby: "Finely crumbled paneer bhurji without chilli, soft roti strips",
  },
];

const GROCERY_MISSING = ["Lauki (bottle gourd)", "Paneer", "Curd", "Chana dal"];

export default function TodayKitchenConcept() {
  const [reaction, setReaction] = useState<"yes" | "no" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const choose = (value: "yes" | "no") => {
    setReaction(value);
    track("concept_reaction", { page: "today_kitchen", wouldUseWeekly: value });
  };

  const submit = () => {
    if (comment.trim()) track("concept_comment", { page: "today_kitchen", comment: comment.trim() });
    setSubmitted(true);
  };

  const shareText = encodeURIComponent(
    `🛒 Today's missing groceries:\n${GROCERY_MISSING.map((g) => `- ${g}`).join("\n")}`
  );

  return (
    <div className="max-w-lg mx-auto space-y-6 px-4 py-6">
      <div className="rounded-xl border border-line bg-tagBg px-4 py-3 text-sm text-tagText">
        This is an early concept, not a live feature yet — we&apos;re showing it around to see if it&apos;s actually
        useful before building it for real. Your honest reaction at the bottom helps us decide.
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-muted">Everyday Nourish</div>
        <h1 className="font-display text-ink text-2xl font-semibold">Today&apos;s Kitchen</h1>
        <div className="text-sm text-muted mt-1">One family meal plan — adapted for everyone, including the baby.</div>
      </div>

      <div className="space-y-3">
        {MEALS.map((m) => (
          <Card key={m.time} title={m.time}>
            <div className="font-medium text-ink mb-2">{m.dish}</div>
            <div className="text-sm text-ink">
              <span className="text-muted">👩‍🍳👨 You &amp; husband: </span>
              {m.adults}
            </div>
            <div className="text-sm text-ink mt-1">
              <span className="text-muted">👶 Baby: </span>
              {m.baby}
            </div>
          </Card>
        ))}
      </div>

      <Card title="For the cook" icon={<ChefHat size={16} className="text-accentDeep" />}>
        <ul className="list-disc list-inside space-y-1 text-sm text-ink">
          <li>Soak chana dal 30 minutes before cooking lunch.</li>
          <li>Keep the baby&apos;s portion of dal and bhurji aside before adding chilli or raw onion.</li>
          <li>Dinner should be ready by 6:30 PM for the baby&apos;s early meal.</li>
        </ul>
      </Card>

      <Card title="Missing groceries" icon={<ShoppingBasket size={16} className="text-accentDeep" />}>
        <ul className="text-sm text-ink space-y-1 mb-3">
          {GROCERY_MISSING.map((g) => (
            <li key={g}>• {g}</li>
          ))}
        </ul>
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("concept_grocery_share_clicked")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white bg-accent"
        >
          <Share2 size={14} /> Share list to WhatsApp
        </a>
      </Card>

      <div className="rounded-xl border border-line bg-card px-4 py-4 text-sm text-ink space-y-3">
        {submitted ? (
          <div>Thank you — this is exactly the kind of honest reaction we needed.</div>
        ) : !reaction ? (
          <>
            <div className="font-medium">Would you actually use something like this every week?</div>
            <div className="flex gap-2">
              <button onClick={() => choose("yes")} className="px-4 py-2 rounded-lg text-sm border border-line text-ink">
                Yes, every week
              </button>
              <button onClick={() => choose("no")} className="px-4 py-2 rounded-lg text-sm border border-line text-ink">
                Not really
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="font-medium">
              {reaction === "yes"
                ? "What would make this even more useful for your family?"
                : "What's the hardest part of managing food for your household, if not this?"}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Tell us in a few words"
                className="flex-1 px-3 py-2 rounded-lg border border-line bg-card text-ink text-sm"
              />
              <button onClick={submit} className="px-4 py-2 rounded-lg text-sm text-white bg-accentDeep">
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
