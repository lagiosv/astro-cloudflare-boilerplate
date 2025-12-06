import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import Sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import icon from 'astro-icon';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sentry Two-SDK Architecture for Cloudflare Workers:
// - Client-side: @sentry/astro via sentry.client.config.js (browser errors)
// - Server-side: @sentry/cloudflare via src/middleware.ts (Worker errors)
// This is required because @sentry/astro server-side doesn't work on Cloudflare runtime.
// See: https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/astro/

export default defineConfig({
  site: 'https://example.com', // Override with PUBLIC_SITE_URL in production
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile', // Build-time optimization with Sharp (Free tier compatible)
  }),

  // Experimental optimizations
  experimental: {
    svgo: true, // Optimize SVG imports at build time (Astro 5.16+)
  },

  // Disable dev toolbar
  devToolbar: {
    enabled: false,
  },

  // Type-safe environment variables (Astro 5.0+)
  env: {
    schema: {
      // Public Client Variables (available in browser)
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SITE_NAME: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_PLAUSIBLE_SCRIPT_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SENTRY_DSN: envField.string({ context: 'client', access: 'public', optional: true }),

      // Secret Server Variables (not in bundle, server only)
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret' }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      CONTACT_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SENTRY_DSN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  integrations: [
    // Sentry: Client-side only (server-side handled by @sentry/cloudflare in middleware)
    Sentry({
      clientInitPath: './sentry.client.config.js',
      autoInstrumentation: {
        requestHandler: false, // Handled by @sentry/cloudflare middleware
      },
    }),
    sitemap(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
  ],

  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
