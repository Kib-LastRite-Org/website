****# Plan: PostCreate MVP — Browser-Native Post Creation System

## Context

The shared `astro6-post-collection-plan.md` proposes a full-stack post editor with React islands, Tiptap, Supabase, and Astro server middleware. This plan adapts it into a **browser-only MVP** that matches the project's actual constraints:

- **Pure SSG** (no `output: 'server'` in astro.config.mjs — no server middleware, no persistent API routes)
- **No React** (not installed, not to be added)
- **No backend yet** — all persistence is browser-native (IndexedDB via `idb`)
- **"Publish" = export `.md` file** → creator drops it in `src/content/posts/` → deploy

User preference: **expand and enhance the schema now**, updating all 7 existing sample posts with placeholder values rather than keeping the old flat structure.

---

## Validated Dependencies

| Package | Version | Size | ESM | Status |
|---|---|---|---|---|
| `idb` | 8.0.3 | ~1.2kB brotli | Yes | Actively maintained, zero Vite/Astro issues |
| `tiny-markdown-editor` | 0.2.25 | <70KB | Yes | Zero deps, clean Markdown output, April 2026 release |

Both confirmed ESM-native, Vite-compatible, no known Astro 6 issues.

Install: `pnpm add idb tiny-markdown-editor`

---

## Schema Migration

### New `content.config.ts` Schema

Expands flat fields to structured objects. All new fields are optional or have defaults so the schema compiles — then existing posts are updated with explicit placeholder values.

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postCollection = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({

    // Core
    title: z.string().min(5).max(120),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    postContent: z.string().max(300),   // excerpt for listings + meta

    // Author (expanded from flat string)
    author: z.object({
      name: z.string(),
      avatarUrl: z.string().url().optional(),
      bio: z.string().max(200).optional(),
    }),

    // Classification
    category: z.string(),               // keep as string; enum enforced in form UI only
    tags: z.array(z.string()).optional().default([]),
    locale: z.string().default('en'),

    // Media (expanded from flat image + imageAlt)
    coverImage: z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }),

    // Publishing
    date: z.coerce.date(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),  // drives SamplePostBanner
    version: z.number().int().default(1),

    // Computed on export (not manually entered)
    readingTime: z.number(),            // integer minutes
    wordCount: z.number(),

    // SEO block (optional — not required for existing posts)
    seo: z.object({
      metaTitle: z.string().max(60).optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().url().optional(),
      noIndex: z.boolean().default(false),
    }).optional(),
  }),
});

export const collections = { posts: postCollection };
```

### Breaking Field Changes

| Old field | New field | Migration |
|---|---|---|
| `author: string` | `author: { name: string, avatarUrl?, bio? }` | All 7 posts updated |
| `image: string` | `coverImage: { src: string, alt: string }` | All 7 posts updated |
| `imageAlt: string` | *(absorbed into coverImage.alt)* | Removed from posts |
| `readTime: string` | `readingTime: number` | All 7 posts updated |
| *(absent)* | `wordCount: number` | All 7 posts get placeholder `wordCount: 800` |
| *(absent)* | `version: number` | All 7 posts get `version: 1` |
| *(absent)* | `status` | All 7 posts get `status: published` |

### Existing Post Placeholder Pattern

Each of the 7 posts in `src/content/posts/` gets updated frontmatter:

```yaml
---
title: "Existing Title"
postContent: "Existing excerpt..."
category: "Feature"
author:
  name: "LastRite Team"
date: 2024-04-01
status: published
version: 1
readingTime: 5
wordCount: 800
coverImage:
  src: "https://..."
  alt: "Existing alt text"
featured: false
draft: true
tags: []
---
```

### Layout Updates Required

**`src/layouts/BlogPost.astro`** — Props interface + template:
- Line 27: `author: string` → `author: { name: string; avatarUrl?: string; bio?: string }`
- Line 28: `image` + `imageAlt` → `coverImage: { src: string; alt: string; caption?: string }`
- Line 32: `readTime: string` → `readingTime: number`
- Lines 487, 538: `{author}` → `{author.name}`
- Lines 491–495, 579–582: `image`/`imageAlt` → `coverImage.src`/`coverImage.alt`
- Lines 483, 189: `{readTime}` → `` {`~${readingTime} min read`} ``

**`src/pages/blog/index.astro`** — Field access:
- Lines 147, 165, 185, 210: `author` → `author.name`
- Lines 155, 157, 199: `image`/`imageAlt` → `coverImage.src`/`coverImage.alt`
- Lines 169, 189, 211: `readTime` → `readingTime`
- Data attribute `data-readtime={parseInt(readTime)}` → `data-readtime={readingTime}`

**`src/pages/blog/[...slug].astro`** — No changes (spreads `post.data` as-is into BlogPost).

---

## Access Control (SSG-compatible)

Route: `src/pages/create.astro`

Since SSG has no server-side middleware, the gate is entirely client-side:

1. On mount: check `sessionStorage.getItem('lr_auth')`
2. If absent: render fullscreen passphrase modal (blocks page interaction)
3. User enters passphrase → PBKDF2-SHA256 derivation (Web Crypto API, 310,000 iterations) → compare against stored hash
4. Match: `sessionStorage.setItem('lr_auth', '1')` → hide modal → reveal form
5. Wrong: increment attempt counter → brief lockout with exponential delay

**Dev mode**: hardcoded passphrase `"lastrite-create"` as fallback (clearly marked `// TODO: swap via .env before deploying`). Production uses `PUBLIC_CREATE_HASH` + `PUBLIC_CREATE_SALT` env vars, generated once via `scripts/gen-passphrase-hash.mjs`.

`<meta name="robots" content="noindex, nofollow">` on the create page.
`/create` added to `public/robots.txt` Disallow.

---

## Browser Storage Architecture

### IndexedDB Database: `lr_posts_db`

Two object stores:

**`drafts`** — Post drafts:
```ts
interface DraftRecord {
  id: string;            // UUID, generated on first save
  title: string;
  slug: string;          // auto-generated from title, editable
  postContent: string;   // excerpt (maps to schema field)
  body: string;          // full markdown (editor content, not in schema)
  category: string;
  author: { name: string; avatarUrl?: string; bio?: string };
  coverImage: { src: string; alt: string; caption?: string };
  tags: string[];
  featured: boolean;
  draft: boolean;
  status: 'draft' | 'published' | 'archived';
  version: number;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[]; ogImage?: string; noIndex: boolean };
  createdAt: number;     // Unix ms
  updatedAt: number;
}
```

**`audit_log`** — Phase 1 audit trail (browser-local):
```ts
interface AuditRecord {
  id: string;
  event: 'draft_created' | 'draft_saved' | 'draft_exported' | 'draft_deleted';
  draftId: string;
  draftTitle: string;
  timestamp: number;
}
```

CRUD in `src/utils/postStorage.ts` (using `idb`):
- `saveDraft(draft)`, `getDraft(id)`, `listDrafts()`, `deleteDraft(id)`
- `appendAuditEvent(record)`, `listAuditEvents(limit?)`

---

## Multi-Step Form

Single `PostCreateForm.astro` component with 5 JS-toggled sections. Progress indicator at top.

```
Step 1 — Basic Info
  title (required, min 5 chars) → auto-generates slug (editable, regex-validated)
  postContent/excerpt (required, max 300 chars, live char counter)
  author.name (required)
  author.bio (optional, max 200)
  category (dropdown: Engineering | Stories | Product Updates | Milestones | Feature | Other)
  locale (default: en)

Step 2 — Content
  tiny-markdown-editor (full toolbar: headings, bold, italic, lists, blockquotes, code, links)
  Live: word count display + computed readingTime ("~4 min read")

Step 3 — Cover Image
  coverImage.src (URL input + live thumbnail preview)
  coverImage.alt (required — progression blocked without it)
  coverImage.caption (optional)

Step 4 — Tags, Flags & SEO
  tags (chip input, comma/space separated, max 10)
  featured toggle, draft toggle (default: true)
  status selector (draft / published / archived)
  SEO accordion (collapsed by default):
    seo.metaTitle (max 60, char counter + SERP preview line)
    seo.metaDescription (max 160, char counter)
    seo.ogImage (URL)
    seo.keywords (comma-separated)
    seo.noIndex (toggle)

Step 5 — Export
  slug review/edit field (editable, real-time regex feedback)
  date picker (defaults to today)
  version display (auto-incremented on each export)
  "Download .md" button → triggers file export
  Post-export: showToast "Post exported! Add to src/content/posts/ and deploy." (success)
  Activity log panel (collapsible): last 20 audit events from IndexedDB
```

### Autosave

Any field change → 3s debounce → `saveDraft()` → IndexedDB write → `appendAuditEvent('draft_saved')`.

Header status indicator: `Saving…` → `Saved ✓` → `Save failed ✗` (reuses existing toast utility patterns).

### Draft Recovery Banner (`DraftRecoveryBanner.astro`)

On form reveal, `listDrafts()` → if results exist:
```
"You have a draft: '[title]' — last saved [relative time]. Resume or start fresh?"
[Resume]  [Discard All]  [View All Drafts ↓]
```

---

## Export (`src/utils/postExporter.ts`)

Converts the in-memory form state to a valid `.md` file:

```md
---
title: "Post Title"
postContent: "Short excerpt…"
author:
  name: "Author Name"
  bio: "Optional bio"
category: "Engineering"
date: 2026-05-01
status: published
version: 1
readingTime: 4
wordCount: 812
coverImage:
  src: "https://..."
  alt: "Description of the image"
featured: false
draft: false
tags: ["tag1", "tag2"]
seo:
  metaTitle: "SEO Title"
  metaDescription: "SEO description"
  noIndex: false
---

[full markdown body]
```

Blob → `URL.createObjectURL` → programmatic `<a download="${slug}.md">` click → `appendAuditEvent('draft_exported')`.

---

## Files

### New Files (MVP)

| File | Purpose |
|---|---|
| `src/pages/create.astro` | Gated page: passphrase modal + form shell + noindex |
| `src/components/post-editor/PostCreateForm.astro` | 5-step form (all sections, JS-toggled) |
| `src/components/post-editor/DraftRecoveryBanner.astro` | "Resume draft?" banner |
| `src/components/post-editor/DraftsList.astro` | Collapsible list of IndexedDB drafts |
| `src/utils/postStorage.ts` | IndexedDB CRUD for drafts + audit log (via `idb`) |
| `src/utils/postExporter.ts` | Form data → YAML frontmatter + `.md` file download |
| `src/utils/slugGenerator.ts` | title → url-safe-slug (lowercase, hyphens, no specials) |
| `src/utils/wordCount.ts` | `wordCount(text)` + `readingTime(words)` → integer minutes |
| `src/styles/post-editor.css` | Form-specific styles (not added to global.css) |
| `scripts/gen-passphrase-hash.mjs` | One-time PBKDF2 hash generator for .env setup |

### Modified Files

| File | Change |
|---|---|
| `src/content.config.ts` | Full schema expansion (author object, coverImage, readingTime, wordCount, seo, version, status) |
| All 7 `src/content/posts/*.md` | Frontmatter migration: flat fields → nested objects + placeholder values |
| `src/layouts/BlogPost.astro` | Props interface + template updated for new field names |
| `src/pages/blog/index.astro` | Field access updated (author.name, coverImage.src, readingTime) |
| `public/robots.txt` | Add `Disallow: /create` |
| `.env.example` | Add `PUBLIC_CREATE_HASH`, `PUBLIC_CREATE_SALT` |
| `CHANGELOG.md` | Document feature |

### NOT Modified

- `src/pages/blog/[...slug].astro` — spreads `post.data` as-is, no direct field access beyond `category` and `date` (which are unchanged)
- `astro.config.mjs` — no output mode change
- `src/styles/global.css` — form styles go in dedicated `post-editor.css`

---

## Out of Scope (Phase 2)

- React integration (explicitly excluded by user)
- Server API routes / Astro SSR mode
- Supabase / any external database
- Multi-user conflict resolution / collaborative editing
- WCAG formal audit
- TOC auto-generation
- Related posts auto-suggest
- Version history diff viewer
- Schema fields: `gallery`, `videoEmbed`, `pinnned`, `contentWarning`, `allowComments`, `shareImage`, `relatedPosts`, `scheduledAt`, `contributors`

---

## Verification (End-to-End)

1. `pnpm build` → confirm all 7 migrated posts compile without Zod errors
2. `pnpm dev` → `/blog` renders correctly with new field paths (author.name, coverImage.src)
3. Visit `/create` → passphrase modal appears → wrong passphrase rejected → correct passphrase reveals form
4. Fill Step 1 → advance → verify "Saving…" → "Saved ✓" in header after 3s
5. Refresh `/create` → enter passphrase again → "Resume draft?" banner appears → Resume pre-fills form
6. Write content in Step 2 → live word count + readingTime update
7. Complete all steps → "Download .md" → inspect file: valid YAML + markdown body
8. Copy downloaded `.md` to `src/content/posts/` → `pnpm build` → post appears at `/blog`
9. Confirm `/create` absent from sitemap + `robots.txt` blocks crawl
10. Check Activity log panel on create page shows audit events
