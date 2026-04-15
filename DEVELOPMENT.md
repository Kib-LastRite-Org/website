# Development Guide

## Setup

### Requirements
- Node.js 18+
- pnpm

### Initial Setup

```bash
pnpm install
pnpm dev
```

The dev server will start at http://localhost:4321.

## Available Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Format code (if configured)
pnpm format

# Lint code (if configured)
pnpm lint
```

## Project Structure

```
src/
├── components/           # Astro components
│   ├── Hero.astro       # Main headline and CTA
│   ├── Features.astro   # Feature cards
│   ├── HowItWorks.astro # Process steps
│   ├── Download.astro   # App download links
│   ├── Toast.astro      # Coming-soon notification
│   └── Footer.astro     # Footer
├── layouts/
│   └── Layout.astro     # Base template
├── pages/
│   ├── index.astro      # Home page
│   ├── privacy.astro    # Privacy Policy
│   └── terms.astro      # Terms of Service
└── styles/
    └── global.css       # Tailwind + global styles

public/
└── favicon.svg          # Site icon

astro.config.mjs         # Astro configuration
package.json             # Dependencies and scripts
```

## Styling

Tailwind CSS v4 is configured in `src/styles/global.css` using `@theme {}` syntax. No separate `tailwind.config.mjs` file.

### Color Palette

```css
--color-primary: #3EB489      /* Mint Green */
--color-secondary: #FF6000    /* Orange */
--color-bg-dark: #07190D      /* Main bg */
--color-card-dark: #2A5F47    /* Card bg */
--color-mint-light: #7DD3C0   /* Hover states */
```

### Using Colors

```html
<!-- Using Tailwind utility classes -->
<button class="bg-[#3EB489] hover:bg-[#7DD3C0] text-white">
  Click me
</button>
```

## Coming-Soon Links

Links that aren't live yet use the `data-coming-soon` attribute. The Toast component intercepts clicks and shows a notification instead of navigating.

```html
<a href="https://app.lastrite.com" data-coming-soon>
  Open Web App
</a>
```

Remove `data-coming-soon` once the link is live.

## Deployment

Vercel automatically deploys from the main branch. To deploy manually:

```bash
vercel --prod
```

## Troubleshooting

### Dev server won't start
```bash
rm -rf node_modules
pnpm install
pnpm dev
```

### Tailwind styles not applying
- Check that your class names are in your HTML/components
- Restart the dev server after modifying `global.css`
- Verify `@tailwindcss/vite` is properly configured in `astro.config.mjs`

### Build errors
```bash
pnpm build  # Run locally to see full error
```

## Resources

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CLAUDE.md](./CLAUDE.md) — Full project details
