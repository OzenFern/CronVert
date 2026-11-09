import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import packageJson from "./package.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({compiler: true}),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: "node",
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  base: "/CronVert/",
});
