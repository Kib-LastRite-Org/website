# Blog Post Visibility & Status UI — Design Spec

**Date:** 2026-05-03
**Scope:** `src/pages/blog/index.astro` only
**Branch:** `feat/supabase-dual-source-cms`

---

## Problem

The Supabase posts table has 4 posts, none of which appear on the blog index. Two bugs:

1. The Supabase query filters `.eq('status', 'published')` — if any row has `status !== 'published'`, it is silently excluded.
2. The `error` field from the Supabase response is discarded (`{ data: supabaseRows }` destructuring), so query failures are invisible.

Additionally, in dev there is no way to see what status each post has, and no way to preview drafts before publishing.

---

## Goals

- **Dev**: Show all posts regardless of status. Display a status badge on every card so the developer can see which posts are published, draft, or archived.
- **Prod**: Show all posts, but lock non-published ones — visible in the grid, not navigable.

---

## Data Layer

### Query change
Remove `.eq('status', 'published')` — fetch all posts in both environments:
```ts
supabase.from('posts').select('*')  // no status filter
```

### Error logging
Destructure the full result and log errors:
```ts
const [mdxEntries, supabaseResult] = await Promise.all([...]);
if (supabaseResult.error) {
  console.error('[blog/index] Supabase fetch failed:', supabaseResult.error.message);
}
```

### Featured post selection
- **Dev**: first featured post, or first post
- **Prod**: first `featured && status === 'published'` post; fallback to first published post; fallback to first post
- `regularPosts` excludes the featured post by reference equality (not by `.featured` flag)

---

## Status Badge

A small colored pill absolutely positioned in the top-right corner of each card image.

| Status    | Background                   | Label      |
|-----------|------------------------------|------------|
| published | `rgba(105, 219, 173, 0.85)`  | Published  |
| draft     | `rgba(245, 158, 11, 0.9)`    | Draft      |
| archived  | `rgba(120, 120, 130, 0.8)`   | Archived   |

Text: white, `0.65rem`, `700` weight, uppercase, `0.07em` letter-spacing.

**Dev**: badge on every card + on featured post (rendered above category chip).
**Prod**: badge only on locked (non-published) cards. Published cards look identical to today.

---

## Locked Card State (prod, non-published only)

Non-published cards in prod are rendered as `<div>` instead of `<a>` so they are not navigable.

Visual treatment:
- `cursor: not-allowed`
- `opacity: 0.75` on the card
- `filter: grayscale(0.6)` on the image
- Centered lock SVG icon over a semi-transparent image overlay (`rgba(5,23,11,0.55)`)
- Status badge still shows (tells users why it's locked)
- Hover scale/glow/transform effects disabled

---

## Unchanged

- Filter, search, sort JavaScript — locked cards participate in filtering
- Prod published cards — zero visual change
- Individual post pages (`/blog/[slug]/`) — out of scope for this spec

---

## Files Changed

- `src/pages/blog/index.astro` — all changes are in this single file
