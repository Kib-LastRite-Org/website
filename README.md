# LastRite — Marketing Website

The official marketing website and landing page for **LastRite**, a digital platform for creating, sharing, and honoring obituaries.

## About LastRite

LastRite makes it easy to create meaningful obituaries, share memories with loved ones, and organize memorial fundraising in all one place. This repository contains the public-facing marketing site built with Astro, while the core application is in continuous development in a separate repository.

## Features

- ✅ Fast, modern Astro 6 build
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Dark/Light theme toggle
- ✅ RSS feed for memorial posts
- ✅ Markdown & MDX blog support
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js ≥ 22.12.0
- pnpm (ES modules enabled)

### Installation

```sh
cd website
pnpm install
```

### Development

```sh
pnpm dev
```

Starts the dev server at `localhost:4321`.

### Production Build

```sh
pnpm build
```

Outputs optimized site to `./dist/`.

### Preview Build Locally

```sh
pnpm preview
```

## Project Structure

```text
├── public/              Static assets
├── src/
│   ├── assets/         Fonts and images
│   ├── components/     Reusable Astro components
│   ├── content/blog/   Memorial posts & stories
│   ├── layouts/        Page templates
│   └── pages/          Routes
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Technologies

- **Astro 6.1.8** — Static site generator
- **@astrojs/mdx** — MDX support for interactive content
- **Sharp** — Image optimization
- **TypeScript** — Type-safe development

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting issues, suggesting features, and submitting pull requests.

## License

All rights reserved. LastRite is proprietary software.
