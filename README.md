# Astro Cloudflare Boilerplate

🚀 Production-ready Astro 5 starter for **Cloudflare Workers** with Tailwind CSS v4, Sentry, Plausible Analytics, and contact forms.

Built with real-world lessons from deploying multiple production sites.

## Why This Boilerplate?

Most Astro starters deploy to Netlify or Vercel. This one is built specifically for **Cloudflare Workers** — the platform Cloudflare now recommends for new projects.

**What makes it different:**

- ⚡ **Edge-first** — Deploys to Cloudflare's global network (300+ cities)
- 🔧 **Production-tested patterns** — Sentry two-SDK architecture, Plausible Oct 2025 script
- 🛡️ **Security built-in** — CSP headers, Turnstile bot protection, secure env handling
- 💰 **Free tier friendly** — Works entirely on Cloudflare's generous free tier

## Features

### Core Stack

- 🚀 **Astro 5** with SSR and type-safe environment variables
- ☁️ **Cloudflare Workers** (NOT Pages) — edge deployment with global CDN
- 🎨 **Tailwind CSS v4** with typography plugin and dark mode
- 📝 **TypeScript** with strict mode

### Developer Experience

- ✏️ **ESLint** compatible with `.astro` files
- 🛠️ **Prettier** compatible with `.astro` files
- 🧹 **Auto-remove unused imports**
- 📦 **Auto-sort imports**
- 🔄 **GitHub Actions** for CI/CD

### Production Ready

- 🐛 **Sentry** error tracking (client + server with two-SDK pattern)
- 📊 **Plausible Analytics** (privacy-friendly, works with Cloud or self-hosted)
- 🤖 **Turnstile** bot protection for forms
- 📧 **Resend** for transactional emails
- 🔒 **Security headers** (CSP, permissions policy, etc.)

### Philosophy

- **Minimal code** — No bloat, only what you need
- **SEO-friendly** — Sitemap, meta tags, Open Graph
- **Production-ready** — Tested patterns from real deployments

## Quick Start

```bash
# Clone the repository
git clone https://github.com/lagiosv/astro-cloudflare-boilerplate.git my-project
cd my-project

# Install dependencies
npm install

# Set up environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your API keys

# Start development server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to see your site.

## Commands

| Command           | Action                                 |
| :---------------- | :------------------------------------- |
| `npm run dev`     | Start dev server at `localhost:4321`   |
| `npm run build`   | Build for production to `./dist/`      |
| `npm run preview` | Preview build locally with Wrangler    |
| `npm run deploy`  | Build and deploy to Cloudflare Workers |
| `npm run check`   | Run Astro, ESLint, and Prettier checks |
| `npm run fix`     | Auto-fix ESLint and Prettier issues    |

## Configuration

### Environment Variables

**Local Development** (`.dev.vars`):

```bash
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA  # Test key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=hello@example.com
SENTRY_DSN=https://xxx@sentry.io/xxx
```

**Production** (Cloudflare Dashboard → Workers → Settings):

| Variable                     | Type     | Description          |
| ---------------------------- | -------- | -------------------- |
| `PUBLIC_SITE_URL`            | Variable | Your site URL        |
| `PUBLIC_TURNSTILE_SITE_KEY`  | Variable | Turnstile widget key |
| `PUBLIC_PLAUSIBLE_SCRIPT_ID` | Variable | Plausible script ID  |
| `TURNSTILE_SECRET_KEY`       | Secret   | Turnstile verify key |
| `RESEND_API_KEY`             | Secret   | Resend API key       |
| `CONTACT_EMAIL`              | Secret   | Form recipient email |
| `SENTRY_DSN`                 | Secret   | Sentry DSN           |

### Deployment

1. Update `name` in `wrangler.jsonc` to your project name
2. Set secrets:
   ```bash
   wrangler secret put TURNSTILE_SECRET_KEY
   wrangler secret put RESEND_API_KEY
   wrangler secret put CONTACT_EMAIL
   ```
3. Deploy: `npm run deploy`
4. Add custom domain in Cloudflare Dashboard

## Project Structure

```
├── src/
│   ├── actions/          # Server-side form handling
│   │   └── index.ts      # Contact form with Turnstile + Resend
│   ├── components/
│   │   ├── PlausibleAnalytics.astro
│   │   └── TurnstileWidget.astro
│   ├── layouts/
│   │   └── Base.astro    # HTML structure + SEO meta
│   ├── pages/
│   │   ├── index.astro   # Home page
│   │   └── contact.astro # Contact form
│   ├── styles/
│   │   └── global.css    # Tailwind imports
│   ├── middleware.ts     # Sentry server-side
│   └── env.d.ts          # TypeScript types
├── public/
│   ├── _headers          # Security headers
│   └── favicon.svg
├── astro.config.ts       # Astro + integrations
├── wrangler.jsonc        # Cloudflare Workers config
├── sentry.client.config.js
└── tailwind.config.js
```

## Key Technical Decisions

### Why Cloudflare Workers (not Pages)?

> "Cloudflare recommends using Cloudflare Workers for new projects."
> — [Astro Docs](https://docs.astro.build/en/guides/deploy/cloudflare/)

Workers provide better SSR support, more bindings (KV, R2, D1), and are the future of Cloudflare's platform.

### Why Two Sentry SDKs?

`@sentry/astro` server-side doesn't work on Cloudflare's runtime. This boilerplate uses:

- `@sentry/astro` for client-side (via `sentry.client.config.js`)
- `@sentry/cloudflare` for server-side (via `src/middleware.ts`)

See: [Sentry Cloudflare + Astro docs](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/astro/)

### Why Plausible with `endpoint` option?

The October 2025 Plausible script update requires the `endpoint` option for proper event tracking. This boilerplate implements it correctly.

## Requirements

- Node.js 18.17.1+ or 20.3.0+
- npm (included with Node.js)
- Cloudflare account (free tier works)

## License

MIT License - feel free to use this for personal or commercial projects.

---

Made with lessons learned from production deployments.
