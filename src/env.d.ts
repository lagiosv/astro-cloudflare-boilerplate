/// <reference types="astro/client" />

// Cloudflare runtime types
interface CloudflareRuntime {
  env: {
    SENTRY_DSN?: string;
    CF_VERSION_METADATA?: { id: string };
    PUBLIC_PLAUSIBLE_SCRIPT_ID?: string;
    [key: string]: string | object | undefined;
  };
  ctx: ExecutionContext;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace App {
  interface Locals {
    runtime: CloudflareRuntime;
  }
}

// Turnstile global
declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
      render: (container: string | HTMLElement, options: object) => string;
    };
  }
}

export {};
