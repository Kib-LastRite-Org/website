Project: kibtestastro1 v0.0.1 — Astro 6.1.8 blog starter template using pnpm.
Node engine: >=22.12.0, ES modules enabled, zero devDependencies declared.

Core dependencies: astro@^6.1.8, @astrojs/mdx@^5.0.3, @astrojs/sitemap@^3.7.2, @astrojs/rss@^4.0.18, sharp@^0.34.3. While using astro ensure to follow standards of astro6[<https://astro.build/blog/astro-6/>](Astro 6 introduces a broad set of new capabilities, including a built-in Fonts API, Content Security Policy API, and support for Live Content Collections that work with your externally-hosted content through the unified Astro content layer.).

TypeScript config extends astro/tsconfigs/strict with strictNullChecks enabled. Target output: dist/ directory.

Astro config: site placeholder at <https://example.com> (needs real domain), MDX and sitemap integrations active. Local font: Atkinson (woff format, 400/700 weights) loaded via CSS variable --font-atkinson with fallback to sans-serif.

Project structure: src/pages/ (routes), src/components/ (reusables), src/content/blog/ (content collections for posts), src/assets/ (fonts, images), public/ (static assets).

Features: minimal styling baseline, Lighthouse 100/100 target, canonical URLs, Open Graph meta, RSS feed generation, Markdown + MDX blog content support.

Scripts: dev (localhost:4321), build (→ dist/), preview (local build preview), astro (CLI passthrough).

Font files location: ./src/assets/fonts/atkinson-regular.woff, ./src/assets/fonts/atkinson-bold.woff with display:swap for non-blocking load.

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
