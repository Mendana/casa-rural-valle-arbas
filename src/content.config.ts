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

export const collections = { activities };
