# Contributing to LastRite Website

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm dev`
4. Open http://localhost:4321 in your browser

## Development Workflow

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### Making Changes

- Edit components in `src/components/`
- Update styles in `src/styles/global.css`
- Add pages in `src/pages/`
- Test locally with `pnpm dev`

### Committing

Keep commits focused and descriptive:

```bash
git commit -m "Add hero section styling improvements"
```

### Pushing and Creating a PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Code Style

- Use semantic HTML
- Follow Tailwind CSS utility naming conventions
- Keep components small and focused
- Test responsive design (mobile, tablet, desktop)

## Testing Checklist

Before submitting a PR:

- [ ] Dev server runs without errors (`pnpm dev`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Links work or have `data-coming-soon` attribute if not live
- [ ] No console errors in DevTools

## Deployment

Merges to `main` automatically deploy to Vercel. Review your changes in staging first.

## Questions?

Ask the team or reference [CLAUDE.md](./CLAUDE.md) for project details.
