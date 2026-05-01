# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Dev auto-fill utility for post editor** — floating ⚡ DEV button (FAB, bottom-right, orange) that populates all 5 form steps with believable LastRite-themed content in one click; DEV-only (`import.meta.env.DEV`), emits zero HTML in production builds
  - 4 seed variants: Engineering, Product Updates, Stories, Milestones — selected randomly per click
  - Keyboard shortcut `Ctrl+Shift+F` / `Cmd+Shift+F`
  - Spring-bounce entrance animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`), pulse-ring on click, CSS-only tooltip, `prefers-reduced-motion` aware
  - New files: `src/utils/devSeedData.ts`, `src/components/post-editor/DevFillButton.astro`
- **Structured debug logging** in post editor — `[PE]` prefixed `console.groupCollapsed` logs for all state transitions: `boot`, `editor:init/ready`, `step:change`, `save:queued/start/success/error`, `draft:load`, `export:start/success`, `validate:error`, `dev:fill`; production dead-code-eliminated via Vite

### Changed

- **Astro 6.1.9 → 6.2.1** — Minor + patch upgrade. Notable 6.2.x additions:
  - Experimental custom logger (structured JSON output for logging agents)
  - SVG Optimizer API — new `svgOptimizer` option (with built-in `svgoOptimizer()`) replaces the old `svgo` flag; relevant for future SVG asset optimization (hero SVG added in v0.2.x)
  - `experimental_getFontFileURL()` helper from `astro:assets` — useful for resolving font URLs from the Astro Fonts API (Inter, Manrope, Atkinson)
  - **6.2.1 patch:** fixes Zod 4.4.0 config validation compatibility — directly benefits `content.config.ts` schema definitions

---

## [0.3.0] - 2026-05-01

### Added

- **`/create` post editor** — browser-native, passphrase-gated post creation tool (no server required)
  - 5-step multi-section form: Basic Info → Content → Cover Image → Settings & SEO → Export
  - PBKDF2-SHA256 passphrase gate (310,000 iterations via Web Crypto API); dev mode passphrase `lastrite-create`; production uses `PUBLIC_CREATE_HASH` + `PUBLIC_CREATE_SALT` env vars
  - Markdown editor powered by `tiny-markdown-editor` with full toolbar and live word count / reading time
  - IndexedDB draft persistence via `idb` — autosave on 3-second debounce with Saved ✓ / Save failed ✗ status indicator
  - Draft recovery banner on page load — resume or discard previous drafts
  - Collapsible sidebar draft list showing all saved drafts with relative timestamps
  - Tag chip input (comma/space/Enter to add, Backspace to remove, max 10)
  - Cover image URL with live thumbnail preview
  - SEO accordion (meta title, meta description, OG image, keywords, noIndex toggle) with live SERP preview
  - Featured, draft, and status toggles
  - Export step: slug review/edit, date picker, version counter, "Download .md" button
  - Activity audit log: last 20 events (created, saved, exported) rendered in-page
  - `scripts/gen-passphrase-hash.mjs` — one-time PBKDF2 hash generator for `.env` setup
  - Page is `noindex, nofollow` and excluded from sitemap via `robots.txt`

- **Expanded post schema** (`src/content.config.ts`) — breaking migration from flat fields to structured objects
  - `author: { name, avatarUrl?, bio? }` (was flat string)
  - `coverImage: { src, alt, caption? }` (was separate `image` + `imageAlt` fields)
  - `readingTime: number` (was `readTime: string`)
  - `wordCount: number` (new)
  - `status: 'draft' | 'published' | 'archived'` (new)
  - `version: number` (new)
  - `seo?: { metaTitle?, metaDescription?, keywords?, ogImage?, noIndex }` (new)
  - All 7 existing sample posts migrated with placeholder values

- **New utilities**
  - `src/utils/postStorage.ts` — IndexedDB CRUD for drafts and audit log
  - `src/utils/postExporter.ts` — converts form state to YAML frontmatter + `.md` download
  - `src/utils/slugGenerator.ts` — title → URL-safe slug
  - `src/utils/wordCount.ts` — word count and reading time helpers

### Changed

- `src/layouts/BlogPost.astro` — updated props and template for new `author`, `coverImage`, and `readingTime` fields
- `src/pages/blog/index.astro` — updated all field accesses (`author.name`, `coverImage.src/alt`, `readingTime`)
- `src/pages/rss.xml.js` — explicit field mapping (`postContent` → `description`, `date` → `pubDate`)
- `public/robots.txt` — added `Disallow: /create`
- `.env.example` — added `PUBLIC_CREATE_HASH` and `PUBLIC_CREATE_SALT`

## [0.2.2] - 2026-04-30

### Added

- **Blog search, filter, and sort**: Implemented client-side blog discovery features on the blog index page
  - Full-text search across post titles and descriptions
  - Category filter pills to narrow posts by topic
  - Sort controls (newest/oldest) for post ordering
  - Icon bug fixes for filter/sort controls

- **Draft banner support**: Blog posts with `draft: true` frontmatter now render a visible draft banner, clearly flagging unpublished content during development

- **Enriched post content**: Expanded blog post articles with richer body content and improved frontmatter metadata (author, category, readTime, tags)

### Changed

- **Search UX improvements**: Added a clear button to the search input; selecting a category now resets the search query to avoid conflicting filter states

---

## [0.2.1] - 2026-04-30

### Added

- **`@/` path alias**: Added `@/*` alias in `tsconfig.json` pointing to `./src/*`, enabling clean absolute imports across all layouts, pages, and components — no more `../../` chains

### Changed

- **Component directory restructure**: Moved shared UI components (`ThemeToggle`, `BackToTopButton`, `FormattedDate`, `Toast`, `ComingSoonToast`) from flat `src/components/` into `src/components/ui/` subdirectory for better organisation

- **Scripts migrated to TypeScript**: Converted `animations.js` and `theme.js` to TypeScript equivalents for type safety

- **All imports converted to `@/` alias**: Replaced all relative `../` and `../../` import paths across components, pages, layouts, and scripts with the `@/*` alias (preserving `src/utils/version.ts` → `package.json` relative import since `package.json` lives outside `src/`)

- **Blog collection renamed to `posts`**: Migrated content collection from `blog` → `posts` and moved content directory from `src/content/blog/` to `src/content/posts/`; updated `content.config.ts`, layouts, and all blog pages accordingly

- **Blog post layout redesigned**: Enhanced post presentation with related posts sidebar (filtered by category), recent posts list, improved hero section with category pills, and skeleton loading states with shimmer animation

- **TypeScript strictest config**: Upgraded `tsconfig.json` to extend `astro/tsconfigs/strictest` (from `strict`); resolved all `exactOptionalPropertyTypes` errors across `BaseHead.astro`, `blog/index.astro`, and `lastRiteToastInterceptor.ts`

- **Image schema simplified**: Changed `content.config.ts` image field from `z.union([z.string(), z.any()])` to `z.string()` for cleaner type safety

- **`.gitignore` updated**: Added `.claude/` directory to `.gitignore` to exclude Claude Code session files from version control

---

## [0.2.0] - 2026-04-24

### Added

- **Working blog post routing**: Implemented dynamic blog post pages with `src/pages/blog/[...slug].astro`
  - Blog posts now fully accessible at `/blog/{post-id}/` routes
  - Uses Astro Content Collections API with `getStaticPaths()` for static generation
  - Properly renders post content with `BlogPost` layout and marketing components

- **Blog navigation**: Added clickable navigation to blog index and individual posts
  - Featured post section now links to full post detail page
  - Blog grid cards fully clickable with hover effects
  - Semantic HTML with proper anchor links throughout

### Changed

- **Removed starter-kit remnants**: Cleaned up all Astro blog template artifacts
  - Deleted 7 starter files (`starter-home`, `starter-blog`, old Header/Footer components)
  - Updated `BlogPost.astro` layout to use `LandingHeader` and `LandingFooter` instead of starter components
  - Removed debug navigation link from `LandingFooter`
  - Updated Bear Blog attribution comments to reflect custom LastRite styling

- **Fixed configuration**: Updated site URL from placeholder to production Vercel domain
  - `astro.config.mjs`: Changed site to `https://website-azure-two-47.vercel.app`
  - Ensures correct canonical URLs, sitemap, and RSS feed generation

- **Improved metadata handling**: Made Open Graph images optional
  - Removed fallback placeholder image from `BaseHead.astro`
  - OG meta tags only included when post provides an image
  - Blog posts with images properly generate social preview cards

- **Fixed RSS feed**: Updated feed item links from `/starter-blog/` to `/blog/` URLs
  - `src/pages/rss.xml.js`: Corrected RSS feed to point to actual blog routes

---

## [0.1.0] - 2026-04-21

### Added

- **New color theme migration**: Migrated to comprehensive dark/light color palette with Tailwind-inspired design tokens
  - Dark mode as default (forest green palette: #05170b background)
  - Light mode available on-demand (warm sanctuary palette: #faf8f5 background)
  - 30+ organized CSS custom properties (surfaces, colors, text roles, utilities)
  - Primary color: Mint (#69dbad dark, #007a58 light)
  - Secondary color: Orange (#ffb691 dark, #a94500 light)

- **Astro 6 Fonts API integration**: Configured system fonts via Fonts API
  - Added Manrope font for display headings (via Fontsource)
  - Added Inter font for body text (via Fontsource)
  - Maintained Atkinson font as fallback
  - All fonts auto-optimized by Astro with preload links

- **Dark/Light mode toggle infrastructure**: Prepared for future user theme selection
  - Class-based theme toggle system (`.light` class on `<html>`)
  - localStorage persistence for user preferences ('dark', 'light', 'system')
  - Inline theme initialization script prevents flash of unstyled content
  - Supports three modes:
    - **dark** (default): Always dark theme
    - **light**: Always light theme
    - **system**: Respects OS preference (prefers-color-scheme)

### Changed

- **Made marketing landing page the root homepage**: Renamed `src/pages/home.astro` → `src/pages/index.astro` to serve the new landing page as the primary entry point. Original starter template preserved at `src/pages/starter-home.astro` (accessible at `/starter-home`) for reference.

- **Updated `src/styles/global.css`**:
  - Replaced simple accent/gray color variables with comprehensive theme system
  - Organized variables by function (surface hierarchy, colors, text roles, utilities)
  - Dark mode as CSS default (no `@media (prefers-color-scheme)` automatic switching)
  - Light mode only applied via explicit `.light` class or 'light'/'system' localStorage
  - Updated base styles (body, headings, links, code) to use new color variables
  - Added `.glass-panel` utility and icon size helpers

- **Updated `astro.config.mjs`**:
  - Added Fontsource providers for Manrope and Inter fonts
  - Fonts automatically cached and optimized by Astro 6

- **Updated `src/components/BaseHead.astro`**:
  - Added inline theme initialization script (is:inline for early execution)
  - No flash of unstyled content on page load

### Created

- **`src/scripts/theme.js`**: Theme management utilities
  - `initTheme()`: Apply saved or default theme on page load
  - `setTheme(theme)`: Set theme to 'dark', 'light', or 'system'
  - `toggleTheme()`: Toggle between dark and light
  - `getCurrentTheme()`: Get current theme preference
  - Supports localStorage persistence

### Maintained

- All layout and spacing unchanged (720px main container, responsive breakpoints)
- All existing pages and blog content remain fully functional
- Backward compatibility with legacy color variable names (--accent, --color-mint, --color-orange)
- Typography hierarchy and sizing unchanged (h1-h6 scale)
- Lighthouse 100/100 target maintained

### Testing

- Validated with Playwright:
  - ✅ Dark mode renders correctly with proper contrast
  - ✅ Light mode renders correctly with proper contrast
  - ✅ Theme persistence via localStorage works
  - ✅ All pages (home, blog, about, blog posts) render without breakages
  - ✅ Typography readable in both themes
  - ✅ Links (mint color) visible and accessible
  - ✅ No visual regressions

### Technical Details

- **Default theme**: Dark (forest green, #05170b)
- **System preference detection**: Only applied when explicitly saved as 'system' preference
- **CSS organization**: Variables grouped by function for future Tailwind migration
- **Font loading**: Optimized via Astro 6 Fonts API (auto-preload, caching, fallbacks)
- **Theme script**: Inline and non-blocking to prevent flash of unstyled content

### Next Steps (Future)

- Implement user-facing theme toggle component (ThemeToggle.astro)
- Add theme selection UI (dark/light/system buttons)
- Migrate remaining styling to Tailwind CSS when ready
- Expand typography scale with new font families

---

## [0.0.1] - 2026-04-23

### Added

- **Version display in footers**: Added semantic versioning (SemVer) support across all layouts
  - Created `src/utils/version.ts` utility to import and export version from package.json
  - Version displayed in footer of both MarketingLayout and BlogPost layouts
  - Format: `vX.Y.Z` (e.g., `v0.0.1`) following [Semantic Versioning 2.0.0](https://semver.org/)
  - Styled with monospace font for technical clarity, subtle gray color to avoid distraction
  - Follows 2026 best practices: Conventional Commits automate version bumps, CHANGELOG tracks releases

---

## Initial Release - Astro 6.1.8 Blog Starter

- Minimal styling baseline from Bear Blog theme
- MDX and sitemap integrations configured
- RSS feed generation
- Content collections for blog posts
