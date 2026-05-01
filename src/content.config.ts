import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postCollection = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),

  schema: z.object({
    // ── Core ────────────────────────────────────────────────────────────
    title: z.string().min(5).max(120),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    postContent: z.string(),

    // ── Author ──────────────────────────────────────────────────────────
    author: z.object({
      name: z.string(),
      avatarUrl: z.string().optional(),
      bio: z.string().max(200).optional(),
    }),

    // ── Classification ───────────────────────────────────────────────────
    category: z.string(),
    tags: z.array(z.string()).optional().default([]),
    locale: z.string().default("en"),

    // ── Media ────────────────────────────────────────────────────────────
    coverImage: z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }),

    // ── Publishing ───────────────────────────────────────────────────────
    date: z.coerce.date(),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    version: z.number().int().default(1),

    // ── Computed on export (not manually entered) ─────────────────────────
    readingTime: z.number(),
    wordCount: z.number(),

    // ── SEO (optional) ────────────────────────────────────────────────────
    seo: z
      .object({
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
        keywords: z.array(z.string()).optional(),
        ogImage: z.string().optional(),
        noIndex: z.boolean().default(false),
      })
      .optional(),
  }),
});

export const collections = {
  posts: postCollection,
};
