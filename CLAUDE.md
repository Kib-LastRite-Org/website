# LastRite Official Website

**Project:** Marketing/landing page for LastRite digital obituary app  
**Tech Stack:** Astro 6.x + Tailwind CSS 4.x + Vercel  
**Status:** Active development  
**Created:** 2026-04-15

---

## Quick Start

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

---

## Design System

**Brand Colors:**
- Primary: Mint Green `#3EB489` — buttons, text highlights
- Secondary: Orange `#FF6F00` — secondary CTA, accents
- Dark Background: `#07190D` — main background
- Dark Card: `#2A5F47` — card backgrounds
- Light Mint: `#7DD3C0` — hover states

**Typography:**
- Font: Roboto (via Google Fonts)
- Sizes: TBD per component

**Spacing & Radius:**
- Card radius: `12px`
- Button radius: `8px`

---

## Key Sections

| Section       | Purpose                                  | CTA          |
| ------------- | ---------------------------------------- | ------------ |
| **Hero**      | Main tagline + value prop + dual CTAs    | Get Started  |
| **Features**  | 4 key capabilities with icons            | —            |
| **HowItWorks**| 3-step process visualization             | —            |
| **Download** | App access (web + Android)               | Links        |
| **Footer**    | Links, privacy, contact, copyright       | —            |

---

## Development Notes

- **Framework:** Astro ships zero JavaScript by default → excellent performance
- **Styling:** Tailwind CSS v4 — CSS-first config via `src/styles/global.css` using `@theme {}` (no `tailwind.config.mjs`). Integration: `@tailwindcss/vite` Vite plugin (replaces deprecated `@astrojs/tailwind`)
- **Components:** All `.astro` files; no framework JS runtime overhead
- **Accessibility:** Use semantic HTML; test with keyboard navigation and screen readers
- **Responsiveness:** Mobile-first design; breakpoints: sm (640px), md (768px), lg (1024px)

---

## Deployment

**Vercel (Recommended):**
```bash
# First time
vercel login
vercel --prod

# Subsequent: push to GitHub → auto-deploys via GitHub integration
```

**Environment:**
- Free Hobby tier: 100GB bandwidth, 6000 build mins/month
- Custom domain support on free tier
- Auto-HTTPS, CDN globally distributed

---

## Link Back to Main App

For branding consistency and design token references:  
→ Flutter app repo: `/Users/kibverse/Projects/flutter/last_rite`

---

## Unverified Links (intercept with coming-soon toast)

Links marked `data-coming-soon` show a toast instead of navigating — remove the attribute once the destination is live:

- `https://app.lastrite.com` — web app (Download.astro)
- Play Store URL (`com.lastrite.app`) — Android app (Download.astro)
- `mailto:hello@lastrite.com` — email inbox (Footer, privacy, terms)

---

## To-Do / Future Enhancements

- [ ] Set up GitHub Actions CI/CD
- [ ] Add analytics (Vercel Analytics)
- [x] Create `/privacy` and `/terms` pages
- [ ] Optimize images (use Astro Image component)
- [ ] Add testimonials/social proof section
- [ ] Set up custom domain (e.g., `lastrite.com`)
- [ ] Email signup for updates
- [ ] Confirm and activate unverified links (app, Play Store, email)
