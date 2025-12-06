/**
 * Astro Actions - Server-side form handling
 *
 * Uses Astro 5 type-safe env variables and Zod validation.
 * Integrates with Turnstile for bot protection and Resend for email.
 */

import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_EMAIL, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { z } from 'astro:schema';
import { Resend } from 'resend';

// Validate Turnstile token with Cloudflare
async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });

  const result = (await response.json()) as { success: boolean };
  return result.success === true;
}

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      message: z.string().min(10, 'Message must be at least 10 characters'),
      'cf-turnstile-response': z.string().min(1, 'Please complete the security check'),
    }),
    handler: async (input) => {
      // Verify Turnstile token
      const isHuman = await verifyTurnstile(input['cf-turnstile-response']);
      if (!isHuman) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Security verification failed. Please try again.',
        });
      }

      // Send email via Resend
      const resend = new Resend(RESEND_API_KEY);
      const recipientEmail = CONTACT_EMAIL || 'hello@example.com';

      try {
        await resend.emails.send({
          from: 'Contact Form <noreply@yourdomain.com>', // TODO: Replace with your Resend verified domain
          to: recipientEmail,
          subject: `New contact from ${input.name}`,
          text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
          replyTo: input.email,
        });

        return { success: true };
      } catch (error) {
        console.error('Email send error:', error);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send message. Please try again later.',
        });
      }
    },
  }),
};
