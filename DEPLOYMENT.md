# Deployment Guide

## Overview

The LastRite website is deployed on **Vercel**. Deployments are automatic on pushes to `main`.

## Vercel Setup

### First-Time Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to project (interactive)
vercel link
```

### Manual Deploy to Production

```bash
vercel --prod
```

### Preview Deploy

```bash
vercel
```

Creates a temporary preview URL without touching production.

## Auto-Deployments (via GitHub)

Once linked, every push to `main` automatically deploys to production.

- Successful builds show a green checkmark in GitHub
- Failed builds show a red X; check Vercel dashboard for logs

## Environment Variables

Vercel environment variables are managed in the Vercel dashboard. Local development uses `.env` file (see `.env.example`).

## Monitoring

- [Vercel Dashboard](https://vercel.com/dashboard) — View deployments and analytics
- Build logs are available in Vercel dashboard
- Check browser console for client-side errors

## Rollback

If a deployment breaks production:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find the deployment to revert to
3. Click "Promote to Production"

Or revert the git commit and push:

```bash
git revert HEAD
git push
# Vercel will auto-deploy the reverted version
```

## Performance

- **Build time:** ~2-5 minutes
- **Bandwidth:** 100GB/month on free tier
- **Functions:** Serverless functions if needed in future

## Custom Domain

Custom domain configuration is in Vercel dashboard under Project Settings → Domains.

## Questions?

See [DEVELOPMENT.md](./DEVELOPMENT.md) for dev setup or check Vercel docs.
