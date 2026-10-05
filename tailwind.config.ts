import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF6ED",
        card: "#FFFFFF",
        ink: "#2B2620",
        muted: "#8A7F6E",
        line: "#E5DCC8",
        accent: "#A8732A",
        accentDeep: "#4B5D3A",
        tagBg: "#F1E6D3",
        tagText: "#8A4A1F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
