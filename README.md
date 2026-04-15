# LastRite

The official marketing website and landing page for **LastRite** — a digital platform for creating, sharing, and honoring obituaries.

## Overview

LastRite makes it easy to create meaningful obituaries, share memories with loved ones, and organize memorial fundraising in one place.

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
cd ~/Projects/js/last_rite_web

# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Tech Stack

- **Framework:** [Astro 6.x](https://astro.build)
- **Styling:** [Tailwind CSS 4.x](https://tailwindcss.com)
- **Deployment:** [Vercel](https://vercel.com)
- **Font:** [Roboto](https://fonts.google.com/specimen/Roboto)

## Project Structure

```
src/
├── components/        # Astro components (Hero, Features, etc.)
├── layouts/          # Base HTML template
├── pages/            # Page routes (index, privacy, terms)
└── styles/           # Global styles & Tailwind config

public/              # Static assets
```

For detailed project structure, see [CLAUDE.md](./CLAUDE.md).

## Pages

- **Home** (`/`) — Main landing page with hero, features, and CTA
- **Privacy** (`/privacy`) — Privacy Policy
- **Terms** (`/terms`) — Terms of Service

## Brand

- **Primary Color:** Mint Green (`#3EB489`)
- **Secondary Color:** Orange (`#FF6F00`)
- **Background:** Dark (`#07190D`)

## Deployment

Deploys automatically to Vercel when pushing to the main branch.

```bash
# Manual deploy to Vercel
vercel --prod
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Contact

For questions or feedback: hello@lastrite.com

---

**Related:** [LastRite Flutter App](https://github.com/lastrite/last_rite)
