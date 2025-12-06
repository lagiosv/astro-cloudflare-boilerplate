/**
 * Astro Middleware with Sentry Cloudflare Integration
 *
 * This middleware wraps all server-side requests with Sentry error tracking.
 * Uses @sentry/cloudflare for the Cloudflare Workers runtime.
 *
 * Client-side errors are handled separately by sentry.client.config.js
 */

import * as Sentry from '@sentry/cloudflare';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Access Cloudflare runtime environment
  const runtime = context.locals.runtime;

  // Skip Sentry if DSN not configured or runtime not available
  if (!runtime?.env?.SENTRY_DSN) {
    return next();
  }

  // Get version ID for release tracking (from CF_VERSION_METADATA binding)
  const versionId = runtime.env.CF_VERSION_METADATA?.id;

  // Wrap request with Sentry error handling
  return Sentry.wrapRequestHandler(
    {
      options: {
        dsn: runtime.env.SENTRY_DSN,
        // Error-only mode: no tracing for minimal overhead
        tracesSampleRate: 0,
        // Use version ID as release for error grouping
        release: versionId,
        // Environment for filtering
        environment: import.meta.env.MODE || 'production',
      },
      request: context.request,
      context: runtime.ctx,
    },
    () => next()
  );
});
