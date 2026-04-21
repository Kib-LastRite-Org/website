# Project: LastRite Marketing Website — Astro 6.1.8 (transitioning from blog starter template)

**Note:** This project was initialized from Astro's official blog starter kit but is now being adapted as the official marketing website for LastRite, a digital platform for creating and sharing obituaries.

Node engine: >=22.12.0, ES modules enabled, zero devDependencies declared.

Core dependencies: astro@^6.1.8, @astrojs/mdx@^5.0.3, @astrojs/sitemap@^3.7.2, @astrojs/rss@^4.0.18, sharp@^0.34.3. While using astro ensure to follow standards of astro6[<https://astro.build/blog/astro-6/>](Astro 6 introduces a broad set of new capabilities, including a built-in Fonts API, Content Security Policy API, and support for Live Content Collections that work with your externally-hosted content through the unified Astro content layer.).

TypeScript config extends astro/tsconfigs/strict with strictNullChecks enabled. Target output: dist/ directory.

Astro config: site placeholder at <https://example.com> (needs real domain), MDX and sitemap integrations active. Local font: Atkinson (woff format, 400/700 weights) loaded via CSS variable --font-atkinson with fallback to sans-serif.

Project structure: src/pages/ (routes: index/home, blog/memorial stories, about), src/components/ (reusables), src/content/blog/ (memorial posts & stories), src/assets/ (fonts, images), public/ (static assets).

Features: LastRite branding, dark/light theme toggle, Lighthouse 100/100 target, canonical URLs, Open Graph meta, RSS feed generation (memorial posts), Markdown + MDX content support.

Scripts: dev (localhost:4321), build (→ dist/), preview (local build preview), astro (CLI passthrough). **Port cleanup:** If port 4321 is stuck in use, run `lsof -ti:4321 | xargs kill -9` to free it before starting dev server.

Font files location: ./src/assets/fonts/atkinson-regular.woff, ./src/assets/fonts/atkinson-bold.woff with display:swap for non-blocking load.

Typography: Body uses Inter (UI Sans), headings use Manrope (Display), long-form content uses Atkinson (Reading) via `.prose` class in BlogPost layout. Code blocks use monospace. This three-tier hierarchy preserves brand voice (Manrope), usability (Inter), and accessibility (Atkinson) without flattening design.

Starter template from Bear Blog theme. No custom integrations or complex config. Ready for blog content in src/content/blog/ using getCollection() API with optional frontmatter schema validation.

MDX Support: Provided via `@astrojs/mdx`. Enables `.mdx` files to embed JSX components and JS expressions within Markdown — useful for interactive content (charts, buttons, alerts).
Key points: [MDX = Markdown + JSX/JS — React-like syntax; tags + `{}` expressions],[Components render as static HTML by default; add a client directive (e.g. `client:load`) to hydrate],[Import and use components inline:

```mdx
  import HeaderLink from './components/HeaderLink.astro';
  <HeaderLink href="/about">About</HeaderLink>
```], [Opt out: remove `@astrojs/mdx` from `astro.config.mjs` to use plain `.md` only].

Documentation & Git: Keep up-to-date: README.md (overview/quick start), LICENSE (proprietary), CHANGELOG.md (all changes), CONTRIBUTING.md (workflow), DEVELOPMENT.md (setup), DEPLOYMENT.md (procedures), .env.example (template).
After tasks: Update relevant docs (especially CHANGELOG.md), provide sample commit message for user to use manually.
Commit format: `<type>(<scope>): <subject>`. Examples: `feat(hero): add animated background`, `fix(toast): correct coming-soon interception`, `docs(changelog): add initial docs`, `refactor(footer): improve spacing`.
