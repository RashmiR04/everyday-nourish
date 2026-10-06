import { Meal } from "./types";
import { computeNutritionFromIngredients } from "./ingredientNutrition";

// Concern notes: each cites a real, checkable source — see source field per note.
// This is general information, not medical advice.
//
// caloriesPerServing/macros below are placeholders overwritten at module load
// (see the MEALS export at the bottom of this file) — the real source of truth
// is each dish's ingredient list computed against ingredientNutrition.ts, not
// these hand-entered numbers. They're left in place only because many dishes'
// placeholder values happen to already be close to the computed ones from an
// earlier verification pass (besan, paneer, and rolled-oats were corrected
// there against published IFCT/USDA figures) — removing them entirely is a
// reasonable future cleanup, but isn't required for correctness.

const MEALS_BASE: Meal[] = [
  {
    id: "m1", name: "Vegetable Besan Chilla", mealType: "breakfast", cookTimeMinutes: 15,
    servingSize: "2 chillas (~160g)", caloriesPerServing: 256,
    macros: { proteinG: 15, carbsG: 36, fatG: 5.3, fiberG: 11 },
    ingredients: [
      { name: "Besan (gram flour)", qty: "60g" },
      { name: "Capsicum", qty: "30g" },
      { name: "Onion", qty: "30g" },
      { name: "Carrot", qty: "20g" },
      { name: "Curd", qty: "50g" },
    ],
    recipeSteps: [
      "Whisk besan with water to a smooth batter.",
      "Stir in finely chopped vegetables, salt, and spices.",
      "Pour onto a hot tawa, cook both sides until golden.",
      "Serve with curd.",
    ],
    concernTags: ["diabetes", "pcos"],
    concernNotes: {
      diabetes: {
        note: "Besan has a lower glycemic index than refined wheat flour, and its protein and fiber content slow sugar absorption.",
        source: "Harvard T.H. Chan School of Public Health — Glycemic Index and Glycemic Load reference",
      },
      pcos: {
        note: "High-protein, low-refined-carb breakfasts are commonly recommended as part of general insulin-friendly eating patterns relevant to PCOS, alongside other lifestyle measures.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Pairs a protein- and fibre-rich legume flour (besan) with vegetables and curd — protein, fibre, and vegetables in one dish, in line with balanced-plate principles.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m2", name: "Oats & Flaxseed Upma", mealType: "breakfast", cookTimeMinutes: 15,
    servingSize: "1 bowl (~220g)", caloriesPerServing: 280,
    macros: { proteinG: 10, carbsG: 44, fatG: 7.6, fiberG: 10 },
    ingredients: [
      { name: "Rolled oats", qty: "50g" },
      { name: "Flaxseed (ground)", qty: "10g" },
      { name: "Green peas", qty: "30g" },
      { name: "Carrot", qty: "30g" },
    ],
    recipeSteps: [
      "Dry roast oats lightly, set aside.",
      "Saute mustard seeds, curry leaves, and vegetables.",
      "Add oats, water, and simmer till soft.",
      "Stir in ground flaxseed just before serving.",
    ],
    concernTags: ["triglycerides", "digestion"],
    concernNotes: {
      triglycerides: {
        note: "Flaxseed provides plant-based omega-3 (ALA) and oats add soluble fibre. Evidence on plant ALA specifically lowering triglycerides is mixed — the American Heart Association notes marine omega-3 (fish-derived EPA/DHA) has stronger evidence for triglyceride-lowering than plant sources.",
        source: "American Heart Association, Triglycerides and Cardiovascular Disease: A Scientific Statement (2011)",
      },
      digestion: {
        note: "Soluble and insoluble fibre from oats supports regular digestion.",
        source: "FDA-authorized health claim on oat beta-glucan soluble fiber and heart health (1997)",
      },
    },
    generalNote: {
      note: "Combines a whole grain (oats) with vegetables for fibre and micronutrient variety in a single bowl.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m3", name: "Moong Dal Chilla with Spinach", mealType: "breakfast", cookTimeMinutes: 15,
    servingSize: "2 chillas (~170g)", caloriesPerServing: 217,
    macros: { proteinG: 16, carbsG: 37, fatG: 0.9, fiberG: 10 },
    ingredients: [
      { name: "Split moong dal", qty: "60g" },
      { name: "Spinach", qty: "40g" },
    ],
    recipeSteps: [
      "Soak and grind moong dal to a thick batter.",
      "Mix in chopped spinach and spices.",
      "Cook on a tawa like a pancake.",
    ],
    concernTags: ["iron", "diabetes"],
    concernNotes: {
      iron: {
        note: "Spinach contributes non-heme iron; pairing with a source of vitamin C at the same meal improves absorption.",
        source: "NIH Office of Dietary Supplements, Iron Fact Sheet for Health Professionals",
      },
      diabetes: {
        note: "Moong dal is high in protein and fibre relative to its carbohydrate content.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Moong dal and spinach together supply plant protein, iron, and folate in one breakfast dish.",
      source: "IFCT 2017 (Indian Food Composition Tables)",
    },
  },
  {
    id: "m4", name: "Dal, Roti & Seasonal Sabzi", mealType: "lunch", cookTimeMinutes: 35,
    servingSize: "1 plate (~350g)", caloriesPerServing: 473,
    macros: { proteinG: 23, carbsG: 83, fatG: 2.1, fiberG: 17 },
    ingredients: [
      { name: "Toor dal", qty: "70g" },
      { name: "Whole wheat roti", qty: "2 pieces" },
      { name: "Potato", qty: "50g" },
      { name: "Cauliflower", qty: "50g" },
    ],
    recipeSteps: [
      "Cook dal with turmeric until soft, temper with cumin and garlic.",
      "Prepare sabzi with minimal oil.",
      "Serve with fresh rotis.",
    ],
    concernTags: [],
    concernNotes: {},
    generalNote: {
      note: "A classic dal-roti-sabzi combination covers protein (dal), whole grain (roti), and vegetable micronutrients (sabzi) in the proportions recommended for a balanced Indian plate.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m5", name: "Rajma with Brown Rice", mealType: "lunch", cookTimeMinutes: 40,
    servingSize: "1 bowl rajma + 1 cup rice (~380g)", caloriesPerServing: 540,
    macros: { proteinG: 25, carbsG: 104, fatG: 2.7, fiberG: 15 },
    ingredients: [
      { name: "Rajma (kidney beans)", qty: "80g" },
      { name: "Brown rice", qty: "70g" },
      { name: "Tomato", qty: "60g" },
    ],
    recipeSteps: [
      "Pressure-cook soaked rajma until soft.",
      "Prepare a tomato-onion gravy and simmer rajma in it.",
      "Serve over cooked brown rice.",
    ],
    concernTags: ["iron", "weightLoss"],
    concernNotes: {
      iron: {
        note: "Rajma is a good plant-based iron source; vitamin C from tomato in the same dish aids absorption.",
        source: "NIH Office of Dietary Supplements, Iron Fact Sheet for Health Professionals",
      },
      weightLoss: {
        note: "High fibre and protein from legumes support satiety.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Legume (rajma) plus whole grain (brown rice) gives a complementary protein profile and sustained energy release.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m6", name: "Methi Thepla with Curd", mealType: "dinner", cookTimeMinutes: 25,
    servingSize: "2 theplas + curd (~220g)", caloriesPerServing: 331,
    macros: { proteinG: 13, carbsG: 60, fatG: 4.1, fiberG: 10 },
    ingredients: [
      { name: "Whole wheat flour", qty: "80g" },
      { name: "Fenugreek leaves", qty: "40g" },
      { name: "Curd", qty: "60g" },
    ],
    recipeSteps: [
      "Knead dough with whole wheat flour, chopped fenugreek, and spices.",
      "Roll and cook on a tawa with minimal oil.",
      "Serve with curd.",
    ],
    concernTags: ["triglycerides", "pcos"],
    concernNotes: {
      triglycerides: {
        note: "Fenugreek is commonly included in heart-friendly Indian diets for its fibre content.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
      pcos: {
        note: "Fenugreek has been studied for PCOS-related insulin resistance, but results are mixed — some trials show modest benefit to lipid profile as an add-on, but it hasn't been shown to replace standard treatment. Worth discussing with your doctor.",
        source: "Systematic review, Avicenna Journal of Phytomedicine (fenugreek supplementation and PCOS)",
      },
    },
    generalNote: {
      note: "Whole wheat flour with fenugreek leaves and curd adds fibre, iron, and probiotic content to a simple flatbread meal.",
      source: "IFCT 2017 (Indian Food Composition Tables)",
    },
  },
  {
    id: "m7", name: "Palak Paneer with Roti", mealType: "dinner", cookTimeMinutes: 30,
    servingSize: "1 bowl + 2 rotis (~320g)", caloriesPerServing: 459,
    macros: { proteinG: 27, carbsG: 38, fatG: 21.4, fiberG: 7 },
    ingredients: [
      { name: "Spinach", qty: "150g" },
      { name: "Paneer", qty: "80g" },
      { name: "Whole wheat roti", qty: "2 pieces" },
    ],
    recipeSteps: [
      "Blanch and puree spinach.",
      "Saute onion-tomato masala, add spinach puree.",
      "Add paneer cubes, simmer briefly.",
      "Serve with rotis.",
    ],
    concernTags: ["iron"],
    concernNotes: {
      iron: {
        note: "Spinach contributes iron, and paneer adds protein and calcium to the same meal.",
        source: "NIH Office of Dietary Supplements, Iron Fact Sheet for Health Professionals",
      },
    },
    generalNote: {
      note: "Spinach, paneer, and roti together supply iron, protein, calcium, and whole grains in one meal.",
      source: "IFCT 2017 (Indian Food Composition Tables)",
    },
  },
  {
    id: "m8", name: "Vegetable Khichdi", mealType: "dinner", cookTimeMinutes: 30,
    servingSize: "1 bowl (~300g)", caloriesPerServing: 362,
    macros: { proteinG: 15, carbsG: 71, fatG: 1, fiberG: 10 },
    ingredients: [
      { name: "Rice", qty: "50g" },
      { name: "Moong dal", qty: "40g" },
      { name: "Carrot", qty: "25g" },
      { name: "French beans", qty: "25g" },
      { name: "Green peas", qty: "30g" },
    ],
    recipeSteps: [
      "Pressure-cook rice, dal, and vegetables together with turmeric.",
      "Temper with cumin and ghee.",
      "Serve hot.",
    ],
    concernTags: ["digestion"],
    concernNotes: {
      digestion: {
        note: "Khichdi is easy to digest and commonly recommended during digestive discomfort.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Rice, moong dal, and vegetables cooked together give an easily digestible, protein-complete one-pot meal.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m9", name: "Roasted Chana", mealType: "snack", cookTimeMinutes: 5,
    servingSize: "1 small bowl (~40g)", caloriesPerServing: 144,
    macros: { proteinG: 8, carbsG: 24, fatG: 2, fiberG: 5 },
    ingredients: [{ name: "Roasted chana", qty: "40g" }],
    recipeSteps: ["Serve roasted chana as-is, optionally with chopped onion and lemon."],
    concernTags: ["iron", "diabetes"],
    concernNotes: {
      iron: {
        note: "Chana is a reasonable plant source of iron for a snack.",
        source: "NIH Office of Dietary Supplements, Iron Fact Sheet for Health Professionals",
      },
      diabetes: {
        note: "High fibre and protein relative to carbohydrate content, compared to typical fried snacks.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Roasted chana is a whole legume snack — higher in protein and fibre, and lower in added fat, than typical fried snacks.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m10", name: "Fruit with Soaked Almonds", mealType: "snack", cookTimeMinutes: 2,
    servingSize: "1 fruit + 5 almonds (~150g)", caloriesPerServing: 122,
    macros: { proteinG: 2, carbsG: 19, fatG: 3.2, fiberG: 4 },
    ingredients: [
      { name: "Seasonal fruit", qty: "120g" },
      { name: "Almonds (soaked)", qty: "5 pieces" },
    ],
    recipeSteps: ["Soak almonds overnight, peel if preferred.", "Serve alongside a seasonal fruit."],
    concernTags: ["hdl", "ldl"],
    concernNotes: {
      hdl: {
        note: "Almonds provide unsaturated fats, often included in patterns associated with healthier HDL levels.",
        source: "American Heart Association — nuts, unsaturated fats, and heart health guidance",
      },
      ldl: {
        note: "Replacing saturated-fat snacks with nuts is a commonly cited dietary pattern for LDL management.",
        source: "American Heart Association — nuts, unsaturated fats, and heart health guidance",
      },
    },
    generalNote: {
      note: "Pairs a whole fruit (fibre, vitamin C) with a small portion of nuts (unsaturated fat) for a balanced snack.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m11", name: "Chia & Curd Bowl", mealType: "snack", cookTimeMinutes: 5,
    servingSize: "1 bowl (~150g)", caloriesPerServing: 122,
    macros: { proteinG: 6, carbsG: 10, fatG: 7.9, fiberG: 3 },
    ingredients: [
      { name: "Curd", qty: "120g" },
      { name: "Chia seeds", qty: "10g" },
    ],
    recipeSteps: [
      "Soak chia seeds in a little water for 10 minutes until gel-like.",
      "Mix into curd.",
      "Optionally add a few chopped fruits.",
    ],
    concernTags: ["triglycerides", "digestion"],
    concernNotes: {
      triglycerides: {
        note: "Chia seeds provide plant-based omega-3 (ALA). Evidence on plant ALA specifically lowering triglycerides is mixed — the American Heart Association notes marine omega-3 (fish-derived EPA/DHA) has stronger evidence for triglyceride-lowering than plant sources.",
        source: "American Heart Association, Triglycerides and Cardiovascular Disease: A Scientific Statement (2011)",
      },
      digestion: {
        note: "Soluble fibre from chia supports regularity.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Curd provides protein and probiotics, and chia seeds add fibre and plant omega-3 to a light snack.",
      source: "IFCT 2017 (Indian Food Composition Tables)",
    },
  },
  {
    id: "m12", name: "Sprouted Moong Chaat", mealType: "snack", cookTimeMinutes: 10,
    servingSize: "1 bowl (~130g)", caloriesPerServing: 39,
    macros: { proteinG: 3, carbsG: 7, fatG: 0.2, fiberG: 2 },
    ingredients: [
      { name: "Sprouted moong", qty: "100g" },
      { name: "Onion, tomato, lemon", qty: "30g" },
    ],
    recipeSteps: ["Mix sprouted moong with chopped onion, tomato, and lemon juice.", "Season with chaat masala."],
    concernTags: ["weightLoss", "diabetes"],
    concernNotes: {
      weightLoss: {
        note: "High protein, high fibre, low calorie density.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
      diabetes: {
        note: "Sprouting lowers the starch content compared to whole legumes, moderating its impact on blood sugar.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Sprouting increases vitamin C content and reduces anti-nutrients in moong, making this a nutrient-dense, low-calorie snack.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m13", name: "Jowar Roti with Lauki Sabzi", mealType: "dinner", cookTimeMinutes: 30,
    servingSize: "2 rotis + sabzi (~300g)", caloriesPerServing: 253,
    macros: { proteinG: 8, carbsG: 56, fatG: 2.5, fiberG: 9 },
    ingredients: [
      { name: "Jowar flour", qty: "70g" },
      { name: "Bottle gourd (lauki)", qty: "150g" },
    ],
    recipeSteps: [
      "Knead jowar flour with warm water, pat into rotis, cook on a tawa.",
      "Prepare lauki sabzi with light tempering.",
      "Serve together.",
    ],
    concernTags: ["bp", "weightLoss"],
    concernNotes: {
      bp: {
        note: "Lauki is low in sodium and jowar is a whole grain, fitting common low-sodium, whole-grain dietary patterns.",
        source: "American Heart Association / DASH dietary pattern — sodium and blood pressure guidance",
      },
      weightLoss: {
        note: "Low calorie density from high water content vegetables.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Jowar is a whole grain alternative to refined wheat, and lauki is a low-calorie-density vegetable — together a light, fibre-rich dinner.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m14", name: "Curd Rice with Pomegranate", mealType: "lunch", cookTimeMinutes: 15,
    servingSize: "1 bowl (~300g)", caloriesPerServing: 246,
    macros: { proteinG: 8, carbsG: 41, fatG: 6.7, fiberG: 2 },
    ingredients: [
      { name: "Cooked rice", qty: "100g" },
      { name: "Curd", qty: "150g" },
      { name: "Pomegranate", qty: "30g" },
    ],
    recipeSteps: [
      "Mix cooked rice with curd and a little milk until creamy.",
      "Temper with mustard seeds and curry leaves.",
      "Top with pomegranate.",
    ],
    concernTags: ["digestion", "bp"],
    concernNotes: {
      digestion: {
        note: "Curd's probiotic content is commonly associated with digestive comfort.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
      bp: {
        note: "Naturally low in added sodium when prepared without salty toppings.",
        source: "American Heart Association / DASH dietary pattern — sodium and blood pressure guidance",
      },
    },
    generalNote: {
      note: "Curd adds probiotics and calcium, and pomegranate contributes vitamin C and polyphenols to a simple rice-based meal.",
      source: "IFCT 2017 (Indian Food Composition Tables)",
    },
  },
  {
    id: "m15", name: "Vegetable Pulao with Raita", mealType: "lunch", cookTimeMinutes: 30,
    servingSize: "1 plate (~350g)", caloriesPerServing: 392,
    macros: { proteinG: 10, carbsG: 73, fatG: 3.8, fiberG: 4 },
    ingredients: [
      { name: "Rice", qty: "80g" },
      { name: "Cabbage", qty: "40g" },
      { name: "Carrot", qty: "30g" },
      { name: "French beans", qty: "30g" },
      { name: "Curd (for raita)", qty: "80g" },
    ],
    recipeSteps: [
      "Saute whole spices, add vegetables and rice, cook with measured water.",
      "Prepare a simple cucumber-curd raita.",
      "Serve together.",
    ],
    concernTags: [],
    concernNotes: {},
    generalNote: {
      note: "Rice and mixed vegetables cooked together, served with curd raita, rounds out grains, vegetables, and probiotic dairy in one plate.",
      source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
    },
  },
  {
    id: "m16", name: "Soya Chunks Curry with Roti", mealType: "lunch", cookTimeMinutes: 25,
    servingSize: "1 bowl soya curry + 2 rotis (~320g)", caloriesPerServing: 363,
    macros: { proteinG: 28, carbsG: 50, fatG: 5.5, fiberG: 11 },
    ingredients: [
      { name: "Soya chunks (dry)", qty: "40g" },
      { name: "Onion-tomato masala", qty: "100g" },
      { name: "Whole wheat roti", qty: "2 pieces" },
    ],
    recipeSteps: [
      "Boil soya chunks for 3-4 minutes, then squeeze out excess water.",
      "Saute onion-tomato masala with ginger-garlic and spices until oil separates.",
      "Add soya chunks, simmer a few minutes to absorb the masala.",
      "Serve with fresh rotis.",
    ],
    concernTags: ["weightLoss", "iron"],
    concernNotes: {
      weightLoss: {
        note: "Soya chunks are a concentrated plant protein (around 50g protein per 100g dry weight) with very little fat, supporting satiety for relatively few calories.",
        source: "USDA FoodData Central — soy protein (textured vegetable protein) nutrient profile",
      },
      iron: {
        note: "Soya chunks contribute non-heme iron; the vitamin C in the tomato-based masala in the same dish helps absorption.",
        source: "NIH Office of Dietary Supplements, Iron Fact Sheet for Health Professionals",
      },
    },
    generalNote: {
      note: "Soya chunks are a concentrated plant protein with very little fat, making this a high-protein, lower-fat alternative to paneer- or ghee-heavy curries.",
      source: "USDA FoodData Central — soy protein (textured vegetable protein) nutrient profile",
    },
  },
  {
    id: "m17", name: "Roasted Soy Nuts", mealType: "snack", cookTimeMinutes: 5,
    servingSize: "1 small bowl (~30g)", caloriesPerServing: 141,
    macros: { proteinG: 12, carbsG: 10, fatG: 7.5, fiberG: 5 },
    ingredients: [{ name: "Roasted soy nuts (soybeans)", qty: "30g" }],
    recipeSteps: ["Serve roasted soy nuts as-is, optionally with a pinch of chaat masala."],
    concernTags: ["ldl", "weightLoss"],
    concernNotes: {
      ldl: {
        note: "Soy protein is associated with modest reductions in LDL cholesterol as part of a diet low in saturated fat.",
        source: "FDA-authorized health claim on soy protein and coronary heart disease risk (1999)",
      },
      weightLoss: {
        note: "High-protein, nutrient-dense snack in a small portion size, supporting satiety.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Roasted soy nuts are a whole-soybean snack providing concentrated plant protein and unsaturated fat in a small portion.",
      source: "USDA FoodData Central",
    },
  },
  {
    id: "m18", name: "Tofu Bhurji with Roti", mealType: "breakfast", cookTimeMinutes: 15,
    servingSize: "1 bowl + 1 roti (~240g)", caloriesPerServing: 249,
    macros: { proteinG: 16, carbsG: 22, fatG: 10.3, fiberG: 3 },
    ingredients: [
      { name: "Tofu", qty: "150g" },
      { name: "Onion-tomato masala", qty: "60g" },
      { name: "Whole wheat roti", qty: "1 piece" },
    ],
    recipeSteps: [
      "Crumble tofu by hand.",
      "Saute onion, tomato, turmeric, and spices until soft.",
      "Add crumbled tofu, mix well, and cook for 3-4 minutes.",
      "Serve with a roti.",
    ],
    concernTags: ["weightLoss", "diabetes"],
    concernNotes: {
      weightLoss: {
        note: "Tofu is low in calories relative to its protein content, helping fill you up for fewer calories than a paneer-based dish.",
        source: "USDA FoodData Central — tofu nutrient profile",
      },
      diabetes: {
        note: "A low-carbohydrate, high-protein breakfast has a smaller impact on post-meal blood sugar than a carb-heavy one.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Tofu is a low-fat, plant-based protein playing a similar role to paneer in Indian cooking, giving a lighter protein-rich start to the day.",
      source: "USDA FoodData Central — tofu nutrient profile",
    },
  },
  {
    id: "m19", name: "Ragi Porridge (Ragi Ganji)", mealType: "breakfast", cookTimeMinutes: 10,
    servingSize: "1 bowl (~220g)", caloriesPerServing: 198,
    macros: { proteinG: 7, carbsG: 29, fatG: 4.9, fiberG: 3 },
    ingredients: [
      { name: "Ragi (finger millet) flour", qty: "30g" },
      { name: "Milk", qty: "150ml" },
    ],
    recipeSteps: [
      "Mix ragi flour with a little water to a lump-free paste.",
      "Simmer in milk, stirring continuously, until thickened.",
      "Serve warm, lightly sweetened if desired.",
    ],
    concernTags: ["digestion", "diabetes"],
    concernNotes: {
      digestion: {
        note: "Ragi (finger millet) is rich in dietary fibre, supporting regular digestion.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
      diabetes: {
        note: "Whole-grain millets like ragi have a lower glycemic index than refined wheat or rice.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Ragi (finger millet) is especially well known as one of the richest plant sources of calcium among common Indian grains.",
      source: "IFCT 2017 (Indian Food Composition Tables)",
    },
  },
  {
    id: "m20", name: "Roasted Peanut Chaat", mealType: "snack", cookTimeMinutes: 5,
    servingSize: "1 small bowl (~55g)", caloriesPerServing: 155,
    macros: { proteinG: 7, carbsG: 6, fatG: 12.3, fiberG: 3 },
    ingredients: [
      { name: "Roasted peanuts (groundnut)", qty: "25g" },
      { name: "Onion, tomato, lemon", qty: "30g" },
    ],
    recipeSteps: ["Mix roasted peanuts with chopped onion, tomato, and lemon juice.", "Season with chaat masala."],
    concernTags: ["hdl", "ldl"],
    concernNotes: {
      hdl: {
        note: "Peanuts provide unsaturated fats, part of dietary patterns associated with healthier HDL levels.",
        source: "American Heart Association — nuts, unsaturated fats, and heart health guidance",
      },
      ldl: {
        note: "Replacing saturated-fat snacks with peanuts is a commonly cited pattern for LDL management.",
        source: "American Heart Association — nuts, unsaturated fats, and heart health guidance",
      },
    },
    generalNote: {
      note: "Peanuts (groundnut) are an affordable, protein- and unsaturated-fat-rich legume, eaten here as a whole food rather than as oil or candy.",
      source: "USDA FoodData Central",
    },
  },
  {
    id: "m21", name: "Sweet Potato Chaat", mealType: "snack", cookTimeMinutes: 15,
    servingSize: "1 bowl (~160g)", caloriesPerServing: 140,
    macros: { proteinG: 2, carbsG: 30, fatG: 0.2, fiberG: 5 },
    ingredients: [{ name: "Sweet potato", qty: "150g" }],
    recipeSteps: [
      "Boil sweet potato until soft, then peel and cube.",
      "Toss with lemon juice and chaat masala.",
    ],
    concernTags: ["bp", "digestion"],
    concernNotes: {
      bp: {
        note: "Sweet potato is a potassium-rich vegetable, consistent with the DASH dietary pattern for blood pressure.",
        source: "American Heart Association / DASH dietary pattern — sodium and blood pressure guidance",
      },
      digestion: {
        note: "The skin and flesh of sweet potato contribute dietary fibre supporting regularity.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Sweet potato is a vitamin-A-rich (beta-carotene) root vegetable, naturally sweet without added sugar.",
      source: "USDA FoodData Central",
    },
  },
  {
    id: "m22", name: "Mushroom Masala with Roti", mealType: "dinner", cookTimeMinutes: 25,
    servingSize: "1 bowl + 2 rotis (~320g)", caloriesPerServing: 253,
    macros: { proteinG: 12, carbsG: 41, fatG: 4.9, fiberG: 7 },
    ingredients: [
      { name: "Button mushroom", qty: "150g" },
      { name: "Onion-tomato masala", qty: "80g" },
      { name: "Whole wheat roti", qty: "2 pieces" },
    ],
    recipeSteps: [
      "Saute onion-tomato masala with ginger-garlic and spices until oil separates.",
      "Add sliced mushrooms, cook until they release and reabsorb their water.",
      "Simmer briefly and serve with rotis.",
    ],
    concernTags: ["weightLoss", "diabetes"],
    concernNotes: {
      weightLoss: {
        note: "Mushrooms are very low in calories and carbohydrate for their volume, adding bulk to a meal without much energy density.",
        source: "USDA FoodData Central — mushroom nutrient profile",
      },
      diabetes: {
        note: "Very low carbohydrate content relative to volume, with minimal impact on blood sugar.",
        source: "ICMR-NIN Dietary Guidelines for Indians, 2024 (nin.res.in)",
      },
    },
    generalNote: {
      note: "Mushrooms add bulk and umami to a dinner curry while contributing very few calories, letting the whole wheat roti carry most of the energy.",
      source: "USDA FoodData Central — mushroom nutrient profile",
    },
  },
];

// The real nutrition pipeline: ingredient list -> ingredientNutrition.ts ->
// computed calories/macros, overwriting whatever placeholder numbers each
// dish above was authored with.
export const MEALS: Meal[] = MEALS_BASE.map((m) => ({
  ...m,
  ...computeNutritionFromIngredients(m.ingredients),
}));

export const CONCERNS: { id: Meal["concernTags"][number]; label: string }[] = [
  { id: "triglycerides", label: "High triglycerides" },
  { id: "hdl", label: "Low HDL" },
  { id: "ldl", label: "High LDL" },
  { id: "diabetes", label: "Blood sugar / diabetes-friendly" },
  { id: "bp", label: "High blood pressure" },
  { id: "iron", label: "Iron / anemia" },
  { id: "pcos", label: "PCOS-friendly" },
  { id: "thyroid", label: "Thyroid-friendly" },
  { id: "digestion", label: "Digestive comfort" },
  { id: "weightLoss", label: "Weight management" },
];

// Pattern-level guidance per health concern, shown when a concern is selected.
// Deliberately framed around the overall dietary pattern rather than any single
// "this food fixes X" claim — no ingredient in this app is positioned as a cure.
export const CONCERN_PATTERN_GUIDANCE: Record<string, string[]> = {
  triglycerides: [
    "Emphasizes soluble fibre from whole grains and legumes",
    "Limits added sugar and refined carbohydrates",
    "Includes plant omega-3 sources, though fish-derived omega-3 has stronger evidence for triglycerides specifically",
  ],
  hdl: [
    "Favors unsaturated fats from nuts and seeds over saturated fats",
    "Includes regular legumes and whole grains",
  ],
  ldl: [
    "Replaces saturated-fat-heavy dishes with nuts, legumes, and whole grains",
    "Increases soluble fibre intake across the week",
  ],
  diabetes: [
    "Favors lower-glycemic whole grains and legumes over refined grains",
    "Pairs protein and fibre at each meal to moderate blood sugar response",
  ],
  bp: [
    "Uses minimal added salt in preparation",
    "Includes potassium-rich vegetables and whole grains, similar to the DASH eating pattern",
  ],
  iron: [
    "Includes iron-rich plant foods (legumes, leafy greens) through the week",
    "Pairs iron sources with vitamin C-rich foods in the same meal to aid absorption",
  ],
  pcos: [
    "Favors higher-protein, lower-refined-carb meals, part of general insulin-friendly eating patterns",
    "No single ingredient is treated as a fix — exercise, sleep, and other factors matter too",
  ],
  thyroid: [
    "Keeps meals balanced and whole-food based rather than built around one 'thyroid food'",
    "Doesn't adjust for iodine intake or medication-timing interactions — discuss specifics with your doctor",
  ],
  digestion: [
    "Includes fibre from whole grains, legumes, and vegetables",
    "Includes probiotic foods like curd regularly",
  ],
  weightLoss: [
    "Favors higher protein and fibre for satiety at moderate calories",
    "Favors whole foods over calorie-dense processed snacks",
  ],
};

export const CONCERN_PATTERN_DISCLAIMER =
  "Dietary patterns matter more than any single food. For abnormal lab results or a diagnosed condition, discuss personalized changes with your doctor or dietitian — this is general information, not medical advice.";

export const CONCERN_TAG_LABELS: Record<string, string> = {
  triglycerides: "Managing high triglycerides",
  hdl: "Improving low HDL",
  ldl: "Managing high LDL",
  diabetes: "Managing blood sugar",
  bp: "Managing high blood pressure",
  iron: "Iron / anemia support",
  pcos: "PCOS support",
  thyroid: "Thyroid support",
  digestion: "Digestive comfort",
  weightLoss: "Weight management",
};

export const MEAL_TYPES: Meal["mealType"][] = ["breakfast", "lunch", "snack", "dinner"];
export const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
};
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const MEAL_TYPE_TIMING_NOTE: Record<string, string> = {
  breakfast:
    "Breakfast dishes here lean toward higher protein and fibre, which support satiety through the morning rather than an early energy dip.",
  lunch:
    "Lunch combines a grain, a protein (dal or legume), and a vegetable — typically the most substantial meal, eaten when most people are most active.",
  snack:
    "Snacks are kept smaller and lower in refined carbs, to bridge appetite between meals without a big blood-sugar swing before the next one.",
  dinner:
    "Dinner dishes are comparatively lighter and easier to digest, since there's usually less activity afterward before sleep.",
};
