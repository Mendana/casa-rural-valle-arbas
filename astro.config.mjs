// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://mendana.github.io",
  base: "/casa-rural-valle-arbas",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      weights: ["200 800"],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "Karla",
      cssVariable: "--font-karla",
      weights: [400, 700],
      styles: ["normal"],
    },
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
