import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      "react/no-children-prop": "off"
    }
  },
  globalIgnores([".next/**", ".remember/**", "out/**", "next-env.d.ts"])
]);
