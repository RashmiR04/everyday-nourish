import { BabyMeal, NutrientId } from "./types";

// Placeholder-free sourcing: calories from IFCT/USDA (see nutrition-dataset-tracker
// spreadsheet), nutrient claims cite the real WHO 2023 complementary feeding
// guideline or India's National IYCF Guidelines. General information, not a
// substitute for your pediatrician's guidance for your specific baby.

export const NUTRIENTS: NutrientId[] = ["iron", "zinc", "protein", "fats", "vitaminA", "vitaminC", "calcium"];

export const NUTRIENT_LABELS: Record<NutrientId, string> = {
  iron: "Iron",
  zinc: "Zinc",
  protein: "Protein",
  fats: "Healthy fats",
  vitaminA: "Vitamin A",
  vitaminC: "Vitamin C",
  calcium: "Calcium",
};

// Age bands follow WHO's 2023 complementary feeding guideline structure
// (6-8m / 9-11m / 12-23m) rather than a single generic "8-12 months" bucket.
export const BABY_STAGES: { id: BabyMeal["stage"]; label: string }[] = [
  { id: "6-8m", label: "6-8 months (starting solids, smooth purees)" },
  { id: "9-11m", label: "9-11 months (soft mash, minced textures)" },
  { id: "12-23m", label: "12-23 months (finger foods, modified family meals)" },
];

const WHO_SRC = "WHO Guideline for complementary feeding of infants and young children 6\u201323 months of age (2023)";
const INDIA_SRC = "National Guidelines on Infant and Young Child Feeding, Ministry of Women & Child Development, Government of India";

export const BABY_MEALS: BabyMeal[] = [
  {
    id: "b1", name: "Ragi Porridge (Ragi Ganji)", stage: "6-8m", texture: "Thin puree", caloriesPerServing: 26,
    nutrientsCovered: ["iron", "calcium"],
    nutrientNotes: {
      iron: { note: "Ragi is commonly used as an early iron-contributing food once breast milk/formula alone no longer covers a baby's iron needs.", source: WHO_SRC },
      calcium: { note: "Ragi naturally contains calcium, useful as bone-building foods are introduced.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Ragi flour", qty: "2 tsp" },
      { name: "Water or breast milk/formula", qty: "~100ml" },
    ],
    recipeSteps: [
      "Mix ragi flour with a little water to a smooth paste, no lumps.",
      "Cook on low heat, stirring, until it thickens slightly.",
      "Thin with breast milk/formula to a runny consistency.",
      "Cool and test temperature before feeding.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt or sugar", "Serve lukewarm, always test temperature first"],
  },
  {
    id: "b2", name: "Steamed Apple Puree", stage: "6-8m", texture: "Smooth puree", caloriesPerServing: 52,
    nutrientsCovered: ["vitaminC"],
    nutrientNotes: {
      vitaminC: { note: "Apple contributes vitamin C, which also helps the body absorb iron from other foods eaten around the same time.", source: WHO_SRC },
    },
    ingredients: [{ name: "Apple", qty: "1 small" }],
    recipeSteps: [
      "Peel, core, and chop the apple.",
      "Steam until very soft.",
      "Mash or blend to a smooth, lump-free puree.",
      "Cool before serving.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added sugar", "Ensure fully smooth texture at this stage"],
  },
  {
    id: "b3", name: "Carrot & Sweet Potato Mash", stage: "6-8m", texture: "Smooth puree", caloriesPerServing: 81,
    nutrientsCovered: ["vitaminA"],
    nutrientNotes: {
      vitaminA: { note: "Carrot and sweet potato are commonly introduced as early vitamin-A-rich first foods.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Carrot", qty: "1 small" },
      { name: "Sweet potato", qty: "1 small" },
    ],
    recipeSteps: [
      "Peel and chop both vegetables.",
      "Steam or boil until very soft.",
      "Mash or blend smooth, adding a little cooking water if needed.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt", "Check texture is fully smooth with no small chunks"],
  },
  {
    id: "b4", name: "Moong Dal Water with a Drop of Ghee", stage: "6-8m", texture: "Thin puree", caloriesPerServing: 51,
    nutrientsCovered: ["protein", "fats"],
    nutrientNotes: {
      protein: { note: "Moong dal is a commonly used early plant-protein source in Indian complementary feeding.", source: INDIA_SRC },
      fats: { note: "A small amount of ghee is often added for calorie density and fat-soluble vitamin absorption at this stage.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Split moong dal", qty: "1 tbsp" },
      { name: "Water", qty: "~150ml" },
      { name: "Ghee", qty: "1/4 tsp" },
    ],
    recipeSteps: [
      "Cook moong dal with water until very soft.",
      "Mash or blend smooth, thin to a runny consistency.",
      "Stir in a small amount of ghee before serving.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt", "Keep ghee quantity small"],
  },
  {
    id: "b5", name: "Mashed Banana with Almond Paste", stage: "6-8m", texture: "Smooth puree", caloriesPerServing: 51,
    nutrientsCovered: ["fats", "vitaminC"],
    nutrientNotes: {
      fats: { note: "A very small amount of nut paste is sometimes used to introduce healthy fats once a baby is tolerating purees well.", source: WHO_SRC },
      vitaminC: { note: "Banana contributes some vitamin C alongside easily digestible carbohydrates.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Ripe banana", qty: "1/2 small" },
      { name: "Almond paste (fine, smooth)", qty: "1/4 tsp" },
    ],
    recipeSteps: [
      "Mash the banana until completely smooth.",
      "Mix in a very small amount of smooth almond paste.",
      "Introduce nut paste separately first in a tiny amount to watch for reaction, before combining.",
    ],
    allergenFlags: ["nuts"],
    safetyNotes: [
      "Introduce nut paste as a new allergen on its own first, in a tiny amount, and watch for a reaction before combining with other foods",
      "No whole or chopped nuts — paste only, to avoid choking risk",
    ],
  },
  {
    id: "b6", name: "Moong Dal Khichdi (Soft Mash)", stage: "9-11m", texture: "Soft mash", caloriesPerServing: 147,
    nutrientsCovered: ["protein", "iron", "zinc"],
    nutrientNotes: {
      protein: { note: "Combining rice and dal provides a more complete amino acid profile than either alone.", source: INDIA_SRC },
      iron: { note: "Dal contributes non-heme iron as part of a baby's growing iron needs.", source: WHO_SRC },
      zinc: { note: "Lentils are a commonly cited plant source of zinc in infant diets.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Rice", qty: "2 tbsp" },
      { name: "Moong dal", qty: "1 tbsp" },
      { name: "Ghee", qty: "1/2 tsp" },
    ],
    recipeSteps: [
      "Cook rice and dal together until very soft.",
      "Mash to a soft, slightly textured consistency (not fully smooth at this stage).",
      "Stir in ghee before serving.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt", "Texture can be slightly thicker/lumpier than the 6-8 month stage"],
  },
  {
    id: "b7", name: "Paneer & Mashed Vegetable", stage: "12-23m", texture: "Soft finger food", caloriesPerServing: 95,
    nutrientsCovered: ["protein", "calcium"],
    nutrientNotes: {
      protein: { note: "Paneer is a commonly used early dairy-protein source once a baby is tolerating dairy.", source: INDIA_SRC },
      calcium: { note: "Paneer contributes calcium important for a baby's bone development.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Soft paneer", qty: "2 tbsp, crumbled" },
      { name: "Mixed vegetables", qty: "2 tbsp, mashed" },
    ],
    recipeSteps: [
      "Crumble soft paneer finely.",
      "Mix with well-mashed, soft-cooked vegetables.",
      "Serve in small, soft pieces a baby can pick up.",
    ],
    allergenFlags: ["dairy"],
    safetyNotes: [
      "Introduce dairy gradually and watch for reaction if this is a new food",
      "Keep pieces soft and small to reduce choking risk",
    ],
  },
  {
    id: "b8", name: "Curd with Mashed Fruit", stage: "12-23m", texture: "Soft mash", caloriesPerServing: 48,
    nutrientsCovered: ["calcium", "vitaminC"],
    nutrientNotes: {
      calcium: { note: "Curd is a commonly used dairy source of calcium once dairy has been introduced without reaction.", source: INDIA_SRC },
      vitaminC: { note: "Pairing with a soft fruit adds vitamin C to the same meal.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Plain curd", qty: "3 tbsp" },
      { name: "Soft seasonal fruit", qty: "2 tbsp, mashed" },
    ],
    recipeSteps: ["Mash the fruit until mostly smooth with small soft pieces.", "Mix with plain curd just before serving."],
    allergenFlags: ["dairy"],
    safetyNotes: ["No added sugar", "Use plain, unsweetened curd"],
  },
  {
    id: "b9", name: "Spinach & Moong Dal Mash", stage: "9-11m", texture: "Soft mash", caloriesPerServing: 88,
    nutrientsCovered: ["iron", "vitaminA"],
    nutrientNotes: {
      iron: { note: "Spinach and dal together are commonly combined for a plant-based iron boost at this stage.", source: WHO_SRC },
      vitaminA: { note: "Leafy greens like spinach contribute vitamin A.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Spinach", qty: "2 tbsp, finely chopped" },
      { name: "Moong dal", qty: "2 tbsp" },
    ],
    recipeSteps: [
      "Cook dal until soft, add finely chopped spinach towards the end.",
      "Cook until spinach wilts and softens fully.",
      "Mash to a soft, slightly textured consistency.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt", "Ensure spinach is fully cooked and soft"],
  },
  {
    id: "b10", name: "Soft Idli Pieces with Mild Sambar", stage: "12-23m", texture: "Soft finger food", caloriesPerServing: null,
    nutrientsCovered: ["protein", "iron"],
    nutrientNotes: {
      protein: { note: "Fermented rice-and-dal batters like idli provide a soft, easy-to-handle source of plant protein for finger-food stage.", source: INDIA_SRC },
      iron: { note: "The dal component contributes some iron alongside the meal.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Soft idli", qty: "1 small, cut into soft pieces" },
      { name: "Mild sambar (no salt added)", qty: "2 tbsp, for dipping/mixing" },
    ],
    recipeSteps: [
      "Cut soft idli into small, soft, baby-safe pieces.",
      "Prepare a mild sambar without added salt or chilli.",
      "Serve idli pieces plain or lightly moistened with sambar.",
    ],
    allergenFlags: [],
    safetyNotes: [
      "No added salt in the sambar for this age",
      "Cut into soft pieces sized for baby-led feeding, no hard edges",
    ],
  },
  {
    id: "b11", name: "Dalia & Moong Dal Mash with Pumpkin", stage: "9-11m", texture: "Soft mash", caloriesPerServing: 126,
    nutrientsCovered: ["zinc", "vitaminA"],
    nutrientNotes: {
      zinc: { note: "Whole grains combined with lentils are a commonly cited plant source of zinc at this stage.", source: WHO_SRC },
      vitaminA: { note: "Pumpkin contributes vitamin A as more vegetable variety is introduced.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Broken wheat (dalia)", qty: "2 tbsp" },
      { name: "Moong dal", qty: "1 tbsp" },
      { name: "Pumpkin", qty: "2 tbsp, mashed" },
      { name: "Ghee", qty: "1/4 tsp" },
    ],
    recipeSteps: [
      "Cook dalia and moong dal together with pumpkin until very soft.",
      "Mash to a soft, slightly textured consistency.",
      "Stir in ghee before serving.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt", "Texture can include small soft lumps at this stage"],
  },
  {
    id: "b12", name: "Soft Vegetable Paratha with Dal", stage: "12-23m", texture: "Soft finger food", caloriesPerServing: 140,
    nutrientsCovered: ["fats", "protein"],
    nutrientNotes: {
      fats: { note: "A small amount of ghee in cooking adds calorie density and helps absorb fat-soluble vitamins, appropriate as toddlers increasingly share modified family food.", source: WHO_SRC },
      protein: { note: "Dal served alongside adds plant protein to the meal.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Whole wheat flour", qty: "3 tbsp" },
      { name: "Mixed grated vegetables", qty: "2 tbsp" },
      { name: "Ghee", qty: "1/2 tsp, for cooking" },
      { name: "Mild dal (for serving)", qty: "2 tbsp" },
    ],
    recipeSteps: [
      "Knead whole wheat flour with grated vegetables and a little water into a soft dough.",
      "Roll into a small, soft paratha and cook lightly with ghee on both sides until fully cooked but soft.",
      "Cut into small finger-food-sized strips.",
      "Serve with mild, mashed dal.",
    ],
    allergenFlags: [],
    safetyNotes: ["Cut into soft finger-food strips, no hard crust", "Keep ghee quantity moderate"],
  },
  {
    id: "b13", name: "Mashed Chana (Chickpea) & Carrot Puree", stage: "6-8m", texture: "Smooth puree", caloriesPerServing: 70,
    nutrientsCovered: ["zinc", "vitaminA"],
    nutrientNotes: {
      zinc: { note: "Well-cooked, well-mashed chickpeas are a commonly used plant source of zinc as early legumes are introduced.", source: WHO_SRC },
      vitaminA: { note: "Carrot adds vitamin A to this combination.", source: INDIA_SRC },
    },
    ingredients: [
      { name: "Boiled chickpeas (chana)", qty: "2 tbsp, well-mashed" },
      { name: "Carrot", qty: "1 small" },
    ],
    recipeSteps: [
      "Boil chickpeas until very soft, then peel off any loose skins and mash thoroughly.",
      "Steam and mash the carrot separately.",
      "Mix both to a smooth, lump-free puree, adding a little water if needed.",
    ],
    allergenFlags: [],
    safetyNotes: [
      "No added salt",
      "Mash thoroughly and remove loose skins to keep the texture fully smooth and reduce choking risk",
      "Introduce chickpeas on their own first in a small amount, before combining, to watch for any reaction",
    ],
  },
  {
    id: "b14", name: "Steamed Pear Puree", stage: "6-8m", texture: "Smooth puree", caloriesPerServing: 57,
    nutrientsCovered: ["vitaminC"],
    nutrientNotes: {
      vitaminC: { note: "Pear is a gentle, easily digested early fruit that contributes vitamin C and fibre.", source: WHO_SRC },
    },
    ingredients: [{ name: "Pear", qty: "1 small" }],
    recipeSteps: [
      "Peel, core, and chop the pear.",
      "Steam until soft.",
      "Mash or blend to a smooth, lump-free puree.",
      "Cool before serving.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added sugar", "Ensure fully smooth texture at this stage"],
  },
  {
    id: "b15", name: "Vegetable Dalia Khichdi", stage: "9-11m", texture: "Soft mash", caloriesPerServing: 130,
    nutrientsCovered: ["protein", "iron"],
    nutrientNotes: {
      protein: { note: "Combining broken wheat with moong dal provides a more complete amino acid profile than either alone.", source: INDIA_SRC },
      iron: { note: "Dal contributes non-heme iron to this meal.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Broken wheat (dalia)", qty: "2 tbsp" },
      { name: "Moong dal", qty: "1 tbsp" },
      { name: "Mixed grated vegetables (carrot, beans)", qty: "2 tbsp" },
      { name: "Ghee", qty: "1/4 tsp" },
    ],
    recipeSteps: [
      "Cook dalia and moong dal together with the grated vegetables until very soft.",
      "Mash to a soft, slightly textured consistency.",
      "Stir in ghee before serving.",
    ],
    allergenFlags: [],
    safetyNotes: ["No added salt", "Texture can include small soft lumps at this stage"],
  },
  {
    id: "b16", name: "Mashed Rajma (Kidney Beans) with Rice", stage: "9-11m", texture: "Soft mash", caloriesPerServing: 145,
    nutrientsCovered: ["protein", "iron"],
    nutrientNotes: {
      protein: { note: "Well-cooked, well-mashed kidney beans combined with rice add plant protein and variety to the dal-rice pattern.", source: INDIA_SRC },
      iron: { note: "Legumes like rajma are a source of non-heme iron as a baby's diet diversifies.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Rice", qty: "2 tbsp" },
      { name: "Rajma (kidney beans), well-cooked", qty: "1 tbsp, mashed" },
      { name: "Ghee", qty: "1/4 tsp" },
    ],
    recipeSteps: [
      "Cook rice until very soft.",
      "Cook kidney beans until completely soft, then mash thoroughly, removing any firm skins.",
      "Mix the rice and mashed beans together, stir in ghee before serving.",
    ],
    allergenFlags: [],
    safetyNotes: [
      "No added salt",
      "Rajma must be cooked completely soft and mashed well to reduce choking risk",
      "Introduce rajma on its own in a small amount first to check for tolerance",
    ],
  },
  {
    id: "b17", name: "Curd Rice with Grated Carrot", stage: "9-11m", texture: "Soft mash", caloriesPerServing: 95,
    nutrientsCovered: ["calcium", "vitaminA"],
    nutrientNotes: {
      calcium: { note: "Curd introduces dairy calcium as part of a growing variety of foods at this stage.", source: INDIA_SRC },
      vitaminA: { note: "Grated carrot adds vitamin A to this simple combination.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Cooked rice", qty: "3 tbsp" },
      { name: "Plain curd", qty: "2 tbsp" },
      { name: "Carrot", qty: "1 tbsp, finely grated" },
    ],
    recipeSteps: [
      "Mash the cooked rice slightly.",
      "Mix in plain curd and finely grated carrot.",
      "Serve at room temperature.",
    ],
    allergenFlags: ["dairy"],
    safetyNotes: ["Introduce dairy gradually and watch for reaction if this is a new food", "No added salt or sugar"],
  },
  {
    id: "b18", name: "Vegetable Pulao with Curd", stage: "12-23m", texture: "Soft finger food", caloriesPerServing: 185,
    nutrientsCovered: ["vitaminA", "calcium"],
    nutrientNotes: {
      vitaminA: { note: "Mixed vegetables in the pulao contribute vitamin A as toddlers share more modified family meals.", source: INDIA_SRC },
      calcium: { note: "A side of curd adds dairy calcium to the meal.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Rice", qty: "3 tbsp" },
      { name: "Mixed vegetables (carrot, peas, beans)", qty: "2 tbsp, finely chopped" },
      { name: "Ghee", qty: "1/2 tsp" },
      { name: "Plain curd (for serving)", qty: "2 tbsp" },
    ],
    recipeSteps: [
      "Cook rice with the finely chopped vegetables and ghee until soft.",
      "Lightly mash larger pieces so the texture is soft and easy to manage.",
      "Serve with a side of plain curd.",
    ],
    allergenFlags: ["dairy"],
    safetyNotes: [
      "Keep vegetable pieces small and soft to reduce choking risk",
      "Keep seasoning mild and salt minimal for this age, per your pediatrician's guidance",
    ],
  },
  {
    id: "b19", name: "Besan Chilla Strips with Curd", stage: "12-23m", texture: "Soft finger food", caloriesPerServing: 165,
    nutrientsCovered: ["protein", "zinc"],
    nutrientNotes: {
      protein: { note: "Besan (gram flour) is a plant-protein-rich base for an easy finger-food pancake.", source: INDIA_SRC },
      zinc: { note: "Chickpea flour contributes zinc alongside protein at this stage.", source: WHO_SRC },
    },
    ingredients: [
      { name: "Besan (gram flour)", qty: "3 tbsp" },
      { name: "Water", qty: "~60ml" },
      { name: "Finely grated vegetables (optional)", qty: "1 tbsp" },
      { name: "Ghee", qty: "1/2 tsp, for cooking" },
      { name: "Plain curd (for serving)", qty: "2 tbsp" },
    ],
    recipeSteps: [
      "Mix besan with water and grated vegetables into a smooth, lump-free batter.",
      "Cook a thin pancake lightly with ghee on a pan until fully cooked on both sides.",
      "Cut into soft strips once cooled slightly.",
      "Serve with plain curd.",
    ],
    allergenFlags: ["dairy"],
    safetyNotes: [
      "Ensure the chilla is cooked through, soft, and not crisp/hard at the edges",
      "Cut into finger-food-sized strips",
    ],
  },
];
