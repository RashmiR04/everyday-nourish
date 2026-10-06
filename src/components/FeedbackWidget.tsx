"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { hasGivenFeedback, markFeedbackGiven } from "@/lib/storage";

export default function FeedbackWidget({ context }: { context: string }) {
  const [given, setGiven] = useState(() => hasGivenFeedback());
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (given) return null;

  const choose = (useful: "yes" | "no") => {
    setChoice(useful);
    track("feedback_rating", { context, useful });
  };

  const submit = () => {
    if (comment.trim()) track("feedback_comment", { context, useful: choice ?? "unknown", comment: comment.trim() });
    markFeedbackGiven();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink">
        Thanks — that helps us improve this.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink space-y-2">
      {!choice ? (
        <>
          <div className="font-medium">Was this useful?</div>
          <div className="flex gap-2">
            <button
              onClick={() => choose("yes")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-line text-ink"
            >
              <ThumbsUp size={14} /> Yes
            </button>
            <button
              onClick={() => choose("no")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-line text-ink"
            >
              <ThumbsDown size={14} /> No
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="font-medium">What would make it more useful? (optional)</div>
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
  );
}
