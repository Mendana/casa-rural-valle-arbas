import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const activities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/activities" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      type: z.string().optional(),
      category: z.enum(["route", "other"]),
      description: z.string(),
      distance: z.string().optional(),
      duration: z.string().optional(),
      elevationGain: z.string().optional(),
      travelTime: z.string().optional(),
      difficulty: z.enum(["baja", "media", "media-alta", "alta"]).optional(),
      group: z.string().optional(),
      link: z.string().url().optional(),
      image: image().optional(),
      alt: z.string().optional(),
    }),
});

const homeHighlights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/home-highlights" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      items: z.array(z.string()).optional(),
      images: z
        .array(
          z.object({
            image: image(),
            alt: z.string(),
            caption: z.string().optional(),
            focus: z.string().optional(),
          }),
        )
        .min(1),
    }),
});

const seasons = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/seasons" }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    dates: z.string(),
    description: z.string(),
  }),
});

const heroGallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/hero-gallery" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      image: image(),
      alt: z.string(),
      caption: z.string().optional(),
    }),
});

const characteristics = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/characteristics" }),
  schema: z.object({
    value: z.string(),
    label: z.string(),
  }),
});

const itemsInHouse = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/items" }),
  schema: z.object({
    price: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    order: z.number(),
    author: z.string(),
    origin: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    text: z.string(),
  }),
});

export const collections = {
  activities,
  homeHighlights,
  seasons,
  heroGallery,
  characteristics,
  itemsInHouse,
  reviews,
};
