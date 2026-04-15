# LastRite Official Website

Marketing/landing page for LastRite digital obituary app. Tech: Astro 6.x + Tailwind CSS 4.x + Vercel. Status: Active development.

Quick Start

```bash
cd ~/Projects/js/last_rite_web

# Install dependencies
pnpm install

# Run dev server (localhost:4321)
pnpm dev

# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

---

## Project Structure

```
src/
├── styles/
│   └── global.css            # Tailwind v4 import + @theme design tokens
├── layouts/
│   └── Layout.astro          # Base HTML template with Roboto font, Open Graph meta
├── components/
│   ├── Toast.astro           # Coming-soon toast (vanilla JS, data-coming-soon attr)
│   ├── Hero.astro            # Main headline + CTA buttons
│   ├── Features.astro        # 4 feature cards (obituary, condolences, fundraising, responsive)
│   ├── HowItWorks.astro      # 3-step process: Create → Share → Remember
│   ├── Download.astro        # App access links (web + Android) — links use data-coming-soon
│   └── Footer.astro          # Footer with links and contact
└── pages/
    ├── index.astro           # Main landing page (composes all sections)
    ├── privacy.astro         # Privacy Policy page
    └── terms.astro           # Terms of Service page

public/
└── favicon.svg               # SVG candle icon in brand colors

astro.config.mjs              # Astro + @tailwindcss/vite config (no tailwind.config.mjs)
```

## Design System

Colors: Primary Mint Green `#3EB489` (buttons/highlights), Secondary Orange `#FF6F00` (CTAs), Dark Background `#07190D`, Dark Card `#2A5F47`, Light Mint `#7DD3C0` (hover).  
Typography: Roboto via Google Fonts. Sizes TBD per component.  
Radius: Cards `12px`, Buttons `8px`.

## Development Notes

- Framework: Astro (zero JS by default, excellent performance). All components are `.astro` files.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` plugin. CSS-first config in `src/styles/global.css` with `@theme {}` (no `tailwind.config.mjs`).
- Accessibility: Semantic HTML, keyboard navigation, screen reader testing.
- Responsiveness: Mobile-first; breakpoints: sm (640px), md (768px), lg (1024px).

## Deployment

Vercel: `vercel login` then `vercel --prod` (first time). Subsequent: push to GitHub for auto-deploy via integration.  
Free tier: 100GB bandwidth, 6000 build mins/month, custom domain support, auto-HTTPS, global CDN.

## Related

Flutter app repo: `/Users/kibverse/Projects/flutter/last_rite` (for branding consistency and design tokens).

## Unverified Links

Links marked `data-coming-soon` show a toast instead of navigating — remove the attribute once the destination is live, note: links for web-app, android-app and email-inbox will be provided when available.

## Documentation & Git

Keep up-to-date: README.md (overview/quick start), LICENSE (proprietary), CHANGELOG.md (all changes), CONTRIBUTING.md (workflow), DEVELOPMENT.md (setup), DEPLOYMENT.md (procedures), .env.example (template).

After tasks: Update relevant docs (especially CHANGELOG.md), provide sample commit message for user to use manually.

Commit format: `<type>(<scope>): <subject>`. Examples: `feat(hero): add animated background`, `fix(toast): correct coming-soon interception`, `docs(changelog): add initial docs`, `refactor(footer): improve spacing`.

## To-Do / Future Enhancements

- [ ] Set up GitHub Actions CI/CD
- [ ] Add analytics (Vercel Analytics)
- [x] Create `/privacy` and `/terms` pages
- [ ] Optimize images (use Astro Image component)
- [ ] Add testimonials/social proof section
- [ ] Set up custom domain (e.g., `lastrite.com`)
- [ ] Email signup for updates
- [ ] Confirm and activate unverified links (app, Play Store, email)
