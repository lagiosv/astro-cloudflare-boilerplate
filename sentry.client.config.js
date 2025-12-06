/**
 * Sentry Client-Side Configuration
 *
 * This file handles browser-side error capture only.
 * Server-side errors are handled by @sentry/cloudflare in src/middleware.ts
 *
 * Optimized for minimal bundle impact (~10-15KB gzipped):
 * - Error capture only (no tracing, no replay)
 * - Conditional loading via SENTRY_DSN
 */

import * as Sentry from '@sentry/astro';

// TODO: Replace with your Sentry DSN from https://sentry.io
// Must be hardcoded because Cloudflare Worker secrets aren't available at build time
const dsn = ''; // e.g., 'https://xxx@o123.ingest.de.sentry.io/456'

if (dsn) {
  Sentry.init({
    dsn,

    // Error-only mode: Disable all performance features to minimize bundle
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Disable distributed tracing headers
    tracePropagationTargets: [],

    // Environment for filtering in Sentry dashboard
    environment: import.meta.env.MODE || 'production',

    // Integrations: Only error capture, no performance or replay
    integrations: [],

    // Don't send default PII for privacy
    sendDefaultPii: false,
  });
}
