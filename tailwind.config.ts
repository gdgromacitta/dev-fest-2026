import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gblue: "#1A73E8",
        gred: "#EA4335",
        gyellow: "#FBBC05",
        ggreen: "#34A853",
        ink: "#111827",
        muted: "#6B7280",
        canvas: "#F8FAFC"
      },
      fontFamily: {
        sans: ["Poppins", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
