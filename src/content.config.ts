import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const activities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/activities" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      type: z.string(),
      category: z.enum(["route", "other"]),
      description: z.string(),
      distance: z.string().optional(),
      duration: z.string().optional(),
      elevationGain: z.string().optional(),
      travelTime: z.string().optional(),
      difficulty: z.enum(["fácil", "media", "difícil"]).optional(),
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
      image: image(),
      image_description: z.string(),
      alt: z.string(),
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

const interior = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/interior" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      image: image(),
      alt: z.string(),
      description: z.string(),
      layout: z.enum(["normal", "raised", "lowered", "small"]).optional(),
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
  interior,
  characteristics,
  itemsInHouse,
  reviews,
};
