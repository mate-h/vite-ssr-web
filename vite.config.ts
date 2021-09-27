import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
// @ts-ignore
import config from "./tailwind.config.js";
import ssr from "vite-plugin-ssr/plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ssr()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(config),
        autoprefixer(),
      ],
    },
  },
  server: {
    hmr: {
      port: 15319,
    },
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "./src/lib"),
    },
  },
});
