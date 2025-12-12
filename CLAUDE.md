# Astro Cloudflare Boilerplate

Shared template for Astro 5 + Cloudflare Workers websites.

## Purpose

This is the **boilerplate** for multi-site deployments:

- BubbleMom.com
- AcceleratePartners.io
- Future sites

Clone this repo to start new sites. Do NOT modify this directly for site-specific changes.

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Framework | Astro 5                       |
| Styling   | Tailwind CSS v4               |
| Hosting   | Cloudflare Workers            |
| Images    | Astro build-time optimization |

## Quick Start (New Site)

```bash
# Clone boilerplate
git clone https://github.com/your-org/astro-cloudflare-boilerplate.git my-new-site
cd my-new-site

# Remove git history and reinitialize
rm -rf .git
git init

# Install and run
npm install
npm run dev
```

## Common Commands

| Command          | Purpose                             |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Development server (localhost:4321) |
| `npm run build`  | Production build                    |
| `npm run deploy` | Build + deploy to Workers           |
| `npm run fix`    | ESLint + Prettier                   |

## Key Files to Customize

| File              | What to Change                    |
| ----------------- | --------------------------------- |
| `wrangler.jsonc`  | Worker name, account ID, bindings |
| `astro.config.ts` | Site URL, integrations            |
| `src/pages/`      | Page content                      |
| `.dev.vars`       | Local environment variables       |

## Configuration

### wrangler.jsonc

```jsonc
{
  "name": "your-site-name", // Change this
  "main": "dist/_worker.js",
  "assets": { "directory": "dist" },
  "compatibility_date": "2024-12-01",
  "compatibility_flags": ["nodejs_compat"],
}
```

### Environment Variables

Copy `.dev.vars.example` to `.dev.vars` for local development.

Set production secrets in Cloudflare Dashboard:

- Build Variables: Client-side (`PUBLIC_*`)
- Runtime Secrets: Server-side (API keys)

## Cloudflare Workers Rules

1. **Deploy**: `wrangler deploy` (NOT `wrangler pages deploy`)
2. **Images**: Use `imageService: 'compile'` (build-time, not Cloudflare Images)
3. **Env vars**: Use `Astro.locals.runtime.env` (NOT `import.meta.env`)
4. **Assets**: The `public/.assetsignore` file excludes `_worker.js` from assets to prevent deployment conflicts

## Image Optimization (LCP)

For best Lighthouse mobile performance:

```astro
<!-- Above-fold images (avatar, hero): eager load + high priority -->
<Image src={hero} loading="eager" fetchpriority="high" />

<!-- Below-fold images: lazy load (default) -->
<Image src={card} loading="lazy" />
```

## Analytics (Plausible)

Uses Oct 2025 script format with unique script IDs per site.

```astro
<!-- Self-hosted (default) -->
<PlausibleAnalytics scriptId="pa-xxx" host="https://analytics.shortcut.gr" />

<!-- Plausible Cloud -->
<PlausibleAnalytics scriptId="pa-xxx" host="https://plausible.io" />
```

Get `scriptId` from Plausible dashboard: Settings > Site Installation.

## Credentials

All API keys, script IDs, and secrets are stored in `~/.claude/credentials.env`.
Never hardcode credentials. Reference the env file for:

- Plausible script IDs
- Cloudflare API tokens
- Sentry DSN
- Resend API keys

## Global Skills (Auto-Triggered)

When working in this project, these skills auto-invoke:

- `cloudflare-workers` - Deployment patterns
- `design-testing` - UI testing with Playwright

## Project Structure

```
src/
├── pages/           # Routes
├── components/      # Reusable components
├── layouts/         # Page layouts
├── assets/images/   # Images (optimized at build)
└── styles/          # Global styles
public/
├── favicon.svg      # Favicon
└── _headers         # Security headers
```

## Adding Features

When adding to boilerplate:

1. Keep it generic (no site-specific content)
2. Document in this file
3. Test with `npm run build`
4. Commit to boilerplate repo
