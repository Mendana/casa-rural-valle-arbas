import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const activities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/activities" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    distance: z.string().optional(),
    difficulty: z.enum(["fácil", "media", "difícil"]).optional(),
    image: z.string(),
  }),
});

const homeHighlights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/home-highlights" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      image: image(),
      image_description: z.string(),
      alt: z.string(),
    }),
});

export const collections = { activities, homeHighlights };
