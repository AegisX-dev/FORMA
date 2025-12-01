import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        paper: "#111111",
        acid: "#D4FF00",
        concrete: "#888888",
      },
      fontFamily: {
        display: ["var(--font-syne)"],
        mono: ["var(--font-jetbrains)"],
      },
      backgroundImage: {
        noise: "url('/noise.png')",
      },
    },
  },
  plugins: [],
};

export default config;
