import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import packageJson from "./package.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: [],

    sortTailwindcss: {
      stylesheet: "./src/index.css",
      functions: ["clsx", "cn"],
    },
  },
  lint: {
    plugins: ["react", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
      "no-case-declarations": "deny",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [react({ compiler: true }), tailwindcss()]),
  test: {
    globals: false,
    environment: "node",
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  base: "/CronVert/",
});
