import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "../assets"),
    },
  },
  publicDir: "../assets",
  build: {
    assetsInlineLimit: 0,
  },
  assetsInclude: ["**/*.glb"],
});
