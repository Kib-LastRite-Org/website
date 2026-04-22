# LastRite Marketing Website

**A high-performance, accessible marketing site for LastRite — a digital platform for creating obituaries, sharing memories, and organizing memorial services.**

LastRite simplifies grief logistics by consolidating obituaries, condolences, memories, service coordination, and fundraising in one respectful space. This repository is the public-facing marketing site (Astro-based static). The core app (Flutter mobile/web) is in a separate private repository.

**Status:** Pre-launch. CTA buttons show "coming soon" toast — the platform is not yet publicly available.

## Technical Highlights

- **Lighthouse 100/100** — Performance, accessibility, SEO optimized
- **Dark/light mode** — System-aware, theme persisted to localStorage, no flash of unstyled content
- **Responsive design** — Mobile-first (375px Android, 390px iPhone tested)
- **Self-hosted fonts** — Manrope (display), Inter (UI), Atkinson (reading) via Astro Fonts API
- **Scroll animations** — GPU-optimized reveal on scroll
- **SEO** — Canonical URLs, Open Graph, sitemap, RSS for posts
- **MDX support** — Interactive blog components (charts, buttons, alerts)
- **Type-safe content** — Collections API with Zod validation

## Site Structure

Marketing landing page (hero, features, how it works, mobile section, testimonials, CTA), about page, and blog for memorial stories. All "coming soon" features intercept via `data-coming-soon` attribute.  

---

## Tech Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| Astro | 6.1.8 | Static site generator (ES modules) |
| TypeScript | (strict) | Type-safe development |
| MDX | 5.0.3 | Markdown + JSX components |
| CSS + Design Tokens | — | Dark/light theme, custom properties |
| Sharp | 0.34.3 | Image optimization |
| @astrojs/rss, @astrojs/sitemap | 4.0.18, 3.7.2 | Feed & SEO |
| pnpm | — | Package manager |

**Requirements:** Node.js ≥ 22.12.0 (ES modules enabled), pnpm

## Getting Started

**Install & run:**

```bash
git clone git@github.com:Kib-LastRite-Org/website.git
cd website && pnpm install && pnpm dev
```

Dev server: `http://localhost:4321` (hot reload enabled)

**Port stuck?** `lsof -ti:4321 | xargs kill -9`

**Build:** `pnpm build` → `dist/` | **Preview:** `pnpm preview`

## Project Structure

```txt
public/                     Static assets
src/
  assets/fonts/            Self-hosted Manrope, Inter, Atkinson
  components/
    landing/               HeroSection, FeaturesSection, etc.
    BaseHead, Header, Footer, ThemeToggle, Toast, etc.
  content/blog/            Markdown/MDX memorial posts
  layouts/BlogPost.astro   Blog post template
  pages/
    index.astro            Landing page
    about.astro            About page
    blog/[...slug].astro   Blog posts
    rss.xml.js, sitemap.xml.ts
  scripts/
    theme.js               Theme toggle + localStorage
    animations.js          Scroll-reveal animations
    *Interceptor.ts        Coming-soon & toast handlers
  styles/global.css        Design tokens, theme variables
  utils/                   Utilities
  content.config.ts        Content schema
  consts.ts                Site constants
astro.config.mjs, tsconfig.json, package.json, pnpm-lock.yaml
```

## Key Systems

**Theme Toggle:** System-aware dark/light mode (`theme.js` + `ThemeToggle.astro`). Persisted to localStorage with FOUC prevention via inline script in `BaseHead.astro`. Design tokens in `global.css`.

**Coming Soon Interceptor:** `data-coming-soon="true"` attribute intercepts clicks and shows toast instead of navigating.

**Toast Notifications:** `Toast.astro`, `ComingSoonToast.astro` components. Triggered via `comingSoonToast()` utility or custom events.

**Scroll Animations:** Elements with `data-delay` animate into view via `animations.js` (Intersection Observer).

## Configuration & Deployment

**Site URL (astro.config.mjs):** Update `site: "https://example.com"` to your actual domain before production (required for canonical URLs, sitemap, RSS).

**No env vars needed** — fully static. If you add backend integrations, create `.env.example` and `.env.local` (add `.env.local` to `.gitignore`).

**Typography:** Three-tier hierarchy via Astro Fonts API:

- Display: Manrope (200, 300, 400, 700)
- UI: Inter (400, 600)
- Reading: Atkinson (400, 700)

**Deploy to:** Vercel (auto-detect), Netlify, Cloudflare Pages, GitHub Pages, or any static host. Push `dist/` output.

## Contributing

Issues and PRs managed by LastRite team. Commit format: `<type>(<scope>): <subject>` (e.g., `feat(hero): add animation`, `fix(toast): intercept logic`).

## License

Proprietary. Source code provided for review/contribution only — unauthorized copying, modification, or distribution prohibited.

## Resources

- [Astro Docs](https://docs.astro.build)
- [MDX Syntax](https://mdxjs.com)
- [LastRite Platform](https://lastrite.com) (when deployed)

For questions, open a GitHub issue.

---

*Built with ❤️ for families remembering their loved ones.*
