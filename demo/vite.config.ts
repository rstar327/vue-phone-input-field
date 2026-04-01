import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/vue-phone-input-field/",
  root: __dirname,
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
