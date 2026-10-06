# Everyday Nourish

A practical Indian meal planner — balanced by default, with optional health-concern
layering (framed around dietary patterns, not single-food cures), ingredient-on-hand
nudging, individualized daily energy/protein targets with portion scaling, a grocery
list, and a separate baby complementary-feeding mode (6-23 months, WHO-aligned age
bands). Every "why it's suggested" note cites a real, checkable source (IFCT 2017 /
USDA for nutrition data; ICMR-NIN 2020/2024, WHO 2023, NIH ODS, FDA, and AHA for the
health claims).

This is general information, not medical advice.

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS. No backend, no
accounts — preferences and the generated plan persist in the browser via
localStorage. No AI calls for plan generation: it's a deterministic, pure function
over a hand-curated, sourced dataset (see `src/lib/meals.ts` and
`src/lib/babyMeals.ts`).

## Running locally

Requires Node.js 18.18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    page.tsx                  landing page
    plan/new/page.tsx         preferences form (concerns, ingredients, household)
    plan/page.tsx             7-day plan view
    plan/grocery-list/page.tsx  aggregated, printable grocery list
    baby/page.tsx             baby mode: stage / plan / nutrient coverage
  components/
    MealCard.tsx              adult dish card (expandable recipe + sourced notes)
    BabyMealCard.tsx           baby dish card (+ allergens, safety notes)
    DisclaimerBanner.tsx
    Nav.tsx
  lib/
    types.ts                  shared TypeScript types
    meals.ts                  real adult dataset (22 dishes, verified calories + macros + sources)
    babyMeals.ts               real baby dataset (12 dishes, 6-8m / 9-11m / 12-23m)
    planner.ts                 pure plan-generation logic incl. portion scaling (unit-testable)
    groceryList.ts              pure grocery aggregation logic (unit-testable)
    nutritionTargets.ts          individualized energy/protein targets (ICMR-NIN 2020 RDA)
    storage.ts                  localStorage helpers
```

## What's genuinely done vs. still open

**Done:** all adult dish calories verified against IFCT 2017 / USDA; all adult
"why it's suggested" notes backed by a real source, every dish (not just
concern-matched ones) now shows a general sourced note; two overclaims caught and
corrected during sourcing (chia/flaxseed + triglycerides; fenugreek + PCOS).
Per-dish macro breakdown (protein/carbs/fat/fibre) added. Daily nutrition targets
are now individualized (sex, age, weight, activity level → ICMR-NIN 2020 energy
and protein reference) instead of one hard-coded range, and portions scale
(capped at 2x) toward that target rather than just being compared against it.
Health-concern selection shows pattern-level guidance ("how this plan is
adapted") plus a doctor/dietitian disclaimer, instead of only per-dish claims.
A second validation pass against published IFCT/USDA figures caught and fixed
real errors in besan, paneer, and rolled-oats protein. Baby dishes sourced
against the real WHO 2023 complementary feeding guideline and India's National
IYCF Guidelines, now split into WHO's three age bands (6-8m / 9-11m / 12-23m)
instead of one generic "8-12m" bucket.

**Still open:**
- "Soft Idli with Mild Sambar" (baby, 12-23m) has no verified calorie figure yet —
  it's a composite cooked dish, better calculated from its own sub-ingredients
  (rice, dal, vegetables) than looked up as one number. The UI honestly shows
  "kcal pending verification" rather than a guess.
- The IFCT/USDA re-validation pass covered the highest-impact ingredients
  (besan, toor dal, paneer, rolled oats, almonds) but not all ~40 ingredients in
  the dataset — the rest are still first-pass estimates.
- Only 22 adult + 12 baby dishes exist, so expect some repetition across a
  7-day week — expanding the dataset (see `nutrition-dataset-tracker.xlsx` from
  the planning phase for the ingredient-verification workflow) is the natural
  next step once there's real usage to justify it.
- Non-veg dishes, accounts, AI-assisted plan generation: all deliberately out of
  scope for this version.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com, "Add New Project", import the repo.
3. Vercel auto-detects Next.js — no config needed. Click Deploy.
4. Once live, you can connect a custom domain under Project Settings → Domains.

No environment variables are required for this version (no backend, no API keys).
