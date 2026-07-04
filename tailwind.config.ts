import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium base
        ink: {
          950: "#05070d",
          900: "#0a0e17",
          850: "#0e1320",
          800: "#121829",
          700: "#1a2236",
          600: "#26314c",
        },
        // Blue accent system
        brand: {
          50: "#eaf2ff",
          100: "#cfe0ff",
          200: "#9cc0ff",
          300: "#669bff",
          400: "#3b7bff",
          500: "#1f63ff",
          600: "#0f4fe6",
          700: "#0a3cb4",
          800: "#0a2f87",
          900: "#0c285f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(31, 99, 255, 0.45)",
        "glow-sm": "0 0 14px rgba(31, 99, 255, 0.35)",
        card: "0 10px 40px rgba(0, 0, 0, 0.55)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 16px rgba(31,99,255,0.35)" },
          "50%": { boxShadow: "0 0 30px rgba(31,99,255,0.65)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
