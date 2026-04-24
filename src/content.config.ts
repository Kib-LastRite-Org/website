import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),

  // Unified LastRite schema with date coercion
  // Note: Uses z.coerce.date() to convert ISO string dates (YYYY-MM-DD) to Date objects
  // Image field uses z.union() to support both URL strings (markdown) and ImageMetadata objects (component props)
  // This matches Astro v6 Content Layer best practices and provides type safety
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    author: z.string(),
    date: z.coerce.date(), // Converts "2024-04-28" → Date object
    readTime: z.string(),
    image: z.union([z.string(), z.any()]), // Allow both URL strings and ImageMetadata objects
    imageAlt: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
