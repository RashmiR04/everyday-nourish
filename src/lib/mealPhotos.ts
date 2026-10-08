interface PhotoRule {
  keywords: string[];
  url: string;
}

// Representative food photos from Wikimedia Commons (freely licensed, no API
// key or account needed). Sourcing an exact photo for every recipe isn't
// realistic for a free project, so similar dishes share one representative
// photo per category, matched by keyword against the dish name. Each was
// manually checked to actually look appetizing before being used here.
const CHILLA = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Chilla_besan.JPG/500px-Chilla_besan.JPG";
const UPMA_PORRIDGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vegetable_Upma.JPG/500px-Vegetable_Upma.JPG";
const CURRY =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Palak_Paneer_at_WCI_2023.jpg/500px-Palak_Paneer_at_WCI_2023.jpg";
const KHICHDI =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Masala_Khichadi.jpg/500px-Masala_Khichadi.jpg";
const RAJMA_RICE = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Rajma_Rice.JPG/500px-Rajma_Rice.JPG";
const CURD_RICE = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Curd_Rice.jpg/500px-Curd_Rice.jpg";
const PULAO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pulao_Vegetable_Methi_India.jpg/500px-Pulao_Vegetable_Methi_India.jpg";
const ROASTED_SNACK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Roasted_Chickpea_Chana_with_Salt_and_Turmeric.jpg/500px-Roasted_Chickpea_Chana_with_Salt_and_Turmeric.jpg";
const CHAAT = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sprout_Chaat.jpg/500px-Sprout_Chaat.jpg";
const FRUIT_NUTS =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Bowl_of_chopped_almonds_no_bg.png/500px-Bowl_of_chopped_almonds_no_bg.png";
const BHURJI =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Homemade_Paneer_Bhurji.jpg/500px-Homemade_Paneer_Bhurji.jpg";
const FALLBACK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Vegetarian_Thali_02.jpg/500px-Vegetarian_Thali_02.jpg";

// Order matters — more specific dish-name keywords are checked before the
// broad "any curry-ish dish" catch-all, so e.g. "Tofu Bhurji with Roti"
// matches bhurji rather than the generic roti/curry rule.
const RULES: PhotoRule[] = [
  { keywords: ["chilla"], url: CHILLA },
  { keywords: ["khichdi"], url: KHICHDI },
  { keywords: ["rajma"], url: RAJMA_RICE },
  { keywords: ["pulao"], url: PULAO },
  { keywords: ["bhurji"], url: BHURJI },
  { keywords: ["chaat"], url: CHAAT },
  { keywords: ["chana", "soy nuts", "peanut"], url: ROASTED_SNACK },
  { keywords: ["upma", "porridge"], url: UPMA_PORRIDGE },
  { keywords: ["fruit", "almond"], url: FRUIT_NUTS },
  { keywords: ["roti", "thepla", "sabzi", "paneer", "masala", "curry", "dal"], url: CURRY },
  { keywords: ["curd"], url: CURD_RICE },
];

export function getMealPhoto(dishName: string): string {
  const lower = dishName.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.url;
  }
  return FALLBACK;
}
