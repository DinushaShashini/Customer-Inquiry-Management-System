import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"]
  },
  resolve: {
    alias: [
      { find: "react", replacement: path.resolve(__dirname, "../node_modules/react") },
      { find: "react-dom", replacement: path.resolve(__dirname, "../node_modules/react-dom") },
      { find: "@", replacement: path.resolve(__dirname, "src") }
    ]
  }
});
