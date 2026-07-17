import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic"
    }
  },
  test: {
    globals: true,
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    exclude: ["node_modules/**", ".next/**"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  }
});
