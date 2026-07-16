import type { Config } from "tailwindcss";

// Design tokens from "DevFest Roma Restyling" (claude.ai/design, option 1a).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "oklch(0.22 0.02 260)",
        muted: "oklch(0.45 0.02 260)",
        faint: "oklch(0.6 0.01 260)",
        mist: "oklch(0.75 0.01 260)",
        tint: "oklch(0.97 0.01 240)",
        line: {
          DEFAULT: "oklch(0.9 0.005 260)",
          soft: "oklch(0.92 0.005 260)",
          strong: "oklch(0.85 0.005 260)"
        },
        primary: {
          DEFAULT: "oklch(0.56 0.19 258)",
          soft: "oklch(0.94 0.03 258)",
          deep: "oklch(0.4 0.15 258)"
        },
        accent: {
          red: "oklch(0.6 0.19 25)",
          "red-soft": "oklch(0.95 0.03 25)",
          "red-deep": "oklch(0.45 0.16 25)",
          yellow: "oklch(0.78 0.15 95)",
          "yellow-soft": "oklch(0.95 0.06 95)",
          "yellow-deep": "oklch(0.45 0.13 80)",
          green: "oklch(0.56 0.15 148)",
          "green-soft": "oklch(0.95 0.03 148)",
          "green-deep": "oklch(0.4 0.13 148)",
          "gray-soft": "oklch(0.95 0.01 260)",
          "gray-deep": "oklch(0.4 0.02 260)",
          bronze: "oklch(0.5 0.03 60)"
        },
        // Legacy Google palette — still referenced by pre-restyle components.
        gblue: "#1A73E8",
        gred: "#EA4335",
        gyellow: "#FBBC05",
        ggreen: "#34A853"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
