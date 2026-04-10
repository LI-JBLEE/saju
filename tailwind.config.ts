import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deepNight: "#1a1a2e",
        midnight: "#2d2d44",
        parchment: "#e8e0d0",
        gold: "#c9a96e",
        silverSand: "#a09880",
        inputBg: "#23233a",
      },
      fontFamily: {
        body: ["var(--font-sans)"],
        display: ["var(--font-serif)"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(201,169,110,0.15), 0 24px 80px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "night-radial":
          "radial-gradient(circle at top, rgba(201,169,110,0.18), transparent 28%), radial-gradient(circle at 20% 20%, rgba(232,224,208,0.08), transparent 25%)",
      },
      animation: {
        "section-fade": "sectionFadeIn 300ms ease-out",
        "gold-pulse": "goldPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        sectionFadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        goldPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
