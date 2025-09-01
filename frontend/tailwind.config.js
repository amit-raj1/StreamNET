import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        streamnet: {
          primary: "#4F46E5",          // Indigo
          secondary: "#10B981",        // Emerald
          accent: "#8B5CF6",           // Violet
          neutral: "#1F2937",          // Gray-800
          "base-100": "#F3F4F6",      // Gray-100
          info: "#3B82F6",             // Blue
          success: "#22C55E",          // Green
          warning: "#F59E0B",          // Amber
          error: "#EF4444",            // Red
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};
