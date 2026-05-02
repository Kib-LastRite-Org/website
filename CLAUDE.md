# Project: LastRite Marketing Website — Astro 6.2.1 (transitioning from blog starter template)

Note: This project was initialized from Astro's official blog starter kit but is now being adapted as the official marketing website for LastRite, a digital platform for creating and sharing obituaries.[docs_etc/from-lastrite-app-project--PROJECT_REPORT.md]

Node engine: >=22.12.0, ES modules enabled. devDependencies: `@astrojs/check@^0.9.8`, `typescript@^5.6.0`.

Core dependencies: astro@^6.2.1, @astrojs/mdx@^5.0.4, @astrojs/sitemap@^3.7.2, @astrojs/rss@^4.0.18, sharp@^0.34.5. While using astro ensure to follow standards of astro6[<https://astro.build/blog/astro-6/>](Astro 6 introduces a broad set of new capabilities, including a built-in Fonts API, Content Security Policy API, and support for Live Content Collections)[<https://astro.build/blog/astro-620/>](Astro 6.2 adds: experimental custom logger for structured JSON output; SVG Optimizer API — `svgOptimizer` option replaces the old `svgo` flag, use `svgoOptimizer()` built-in; `experimental_getFontFileURL()` helper from `astro:assets`; 6.2.1 patch fixes Zod 4.4.0 compatibility in config validation — benefits `content.config.ts`)(Always ensure to use Astro-6-&-onwards features).

- logs/documentations etc are kept in folder `./docs_etc/`.
- Leverage **context7** for version-accurate library/framework docs; **sequentialthinking** for structured reasoning, task decomposition, and multi-step planning; **playwright** for real browser-based testing, interaction, and visual validation; and **web search** for current, validated external data beyond training knowledge.

TypeScript config extends astro/tsconfigs/strictest with strictNullChecks and exactOptionalPropertyTypes enabled. Target output: dist/ directory. When adding optional properties that may be undefined, annotate as `prop?: Type | undefined` instead of `prop?: Type`.

Astro config: site set to `https://website-azure-two-47.vercel.app` (with `VERCEL_URL` env override), MDX and sitemap integrations active. All three fonts loaded via Astro Fonts API (`fontProviders.local()` in `astro.config.mjs`): Inter → `--font-sans`, Manrope → `--font-display`, Atkinson → `--font-atkinson` (woff, 400/700). Update site URL to production domain before launch.

Project structure: src/pages/ (routes: index/marketing landing, starter-home/original template, blog/memorial stories, about), src/components/ (reusables), src/content/posts/ (memorial posts & stories), src/assets/ (fonts, images), public/ (static assets).

Features: LastRite branding, dark/light theme toggle, Lighthouse 100/100 target, canonical URLs, Open Graph meta, RSS feed generation (memorial posts), Markdown + MDX content support.

**Responsive Design & Mobile Testing:**

- Primary breakpoint at 720px (hides nav-links, shows hamburger menu; buttons moved to mobile menu to prevent overflow)
- Secondary breakpoint at 480px (optimizes toast, spacing, fonts for small phones like Android at 375px width)
- When positioning elements with left/right on mobile, use `width: auto` (not `width: 100%`) to respect margin constraints
- Always test at actual device widths (375px for Android, 390px for iPhone) — not just breakpoints — to catch edge cases
- Test theme toggle and all interactive components at smallest widths before committing

Scripts: dev (localhost:4321), build (→ dist/), preview (local build preview), astro (CLI passthrough). **Port cleanup:** If port 4321 is stuck in use, run `lsof -ti:4321 | xargs kill -9` to free it before starting dev server.

Font files location: ./src/assets/fonts/atkinson-regular.woff, ./src/assets/fonts/atkinson-bold.woff with display:swap for non-blocking load.

Typography: Body uses Inter (UI Sans), headings use Manrope (Display), long-form content uses Atkinson (Reading) via `.prose` class in BlogPost layout. Code blocks use monospace. This three-tier hierarchy preserves brand voice (Manrope), usability (Inter), and accessibility (Atkinson) without flattening design.

Starter template from Bear Blog theme. No custom integrations or complex config. Ready for blog content in src/content/posts/ using getCollection() API with optional frontmatter schema validation.

MDX Support: Provided via `@astrojs/mdx`. Enables `.mdx` files to embed JSX components and JS expressions within Markdown — useful for interactive content (charts, buttons, alerts).
Key points: [MDX = Markdown + JSX/JS — React-like syntax; tags + `{}` expressions],[Components render as static HTML by default; add a client directive (e.g. `client:load`) to hydrate],[Import and use components inline:

```mdx
  import HeaderLink from './components/HeaderLink.astro';
  <HeaderLink href="/about">About</HeaderLink>
```], [Opt out: remove `@astrojs/mdx` from `astro.config.mjs` to use plain `.md` only].

**Tailwind v4 Hybrid Migration:**

Installed tailwindcss@4.2.4 + @tailwindcss/vite@4.2.4. Uses CSS-first hybrid approach: keep existing design system (tokens, theme, components, animations) while adding Tailwind utilities for layout/spacing/flex/grid.

Implementation: `@theme` block in `src/styles/global.css` maps CSS variables to Tailwind utilities (`--color-primary: var(--color-primary)` → `bg-primary`). Self-referential CSS variables resolve at runtime for live theme switching. **No tailwind.config.js** — that's Tailwind v3 only.

Keep in CSS: complex effects (gradients, ::before/::after), animations, typography hierarchy, all tokens, component classes (`.btn`, `.glass-panel`). Convert to Tailwind: simple layout patterns (flex, gap, padding, grid), spacing utilities, responsive wrappers.

Process: (1) Start with components that have layout-only CSS, (2) add Tailwind classes to markup, remove equivalent CSS rules, (3) test at actual widths (375px/390px), (4) build to verify, (5) commit. DO: Replace simple flex/gap patterns. DON'T: Use `@apply` heavily, create config.js, use Tailwind dark mode, mix Tailwind utils with animated/complex-styled components.

Documentation & Git: Keep up-to-date: README.md (overview/quick start), LICENSE (proprietary), CHANGELOG.md (all changes), CONTRIBUTING.md (workflow), DEVELOPMENT.md (setup), DEPLOYMENT.md (procedures), .env.example (template).
After tasks: Update relevant docs (especially CHANGELOG.md), provide sample commit message for user to use manually.
Commit format: `<type>(<scope>): <subject>`. Examples: `feat(hero): add animated background`, `fix(toast): correct coming-soon interception`, `docs(changelog): add initial docs`, `refactor(footer): improve spacing`.
