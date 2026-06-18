import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  envDir: "../../",
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@web": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "../api/src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/rpc": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
