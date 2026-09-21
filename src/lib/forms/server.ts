import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createBrevoAdapter, type EmailProvider } from "./brevo";
import { deliverStoredFormSubmission, type SubmissionStore } from "./delivery";
import type { FormSubmission, FormSubmitResult } from "./types";

export type { SubmissionStore } from "./delivery";

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

function defaultStore(): SubmissionStore {
  const client = createAdminClient();
  return {
    async insert(submission) {
      const { data, error } = await client.from("form_submissions").insert({
        form_type: submission.formType, status: submission.status, recipient: submission.recipient,
        name: submission.name, email: submission.email, phone: submission.phone ?? null,
        organization: submission.organization ?? null, reason: submission.reason ?? null,
        message: submission.message ?? null, locale: submission.locale, payload: submission.payload,
        received_at: submission.receivedAt,
      }).select("id").single();
      if (error || !data) throw new Error("Unable to store form submission.");
      return { id: data.id };
    },
    async update(id, status, details) {
      const { error: updateError } = await client.from("form_submissions").update({
        status, delivered_at: status === "delivered" ? new Date().toISOString() : null,
        delivery_error: details?.error?.slice(0, 500) ?? null,
        provider_message_id: details?.providerMessageId ?? null,
      }).eq("id", id);
      if (updateError) throw new Error("Unable to update form delivery status.");
    },
  };
}

export function isAllowedFormOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const configured = process.env.SITE_URL?.replace(/\/$/, "");
  const requestOrigin = new URL(request.url).origin;
  return origin === requestOrigin || origin === configured;
}

export function isRateLimited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rateLimits.get(ip);
  if (!current || current.resetAt <= now) { rateLimits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function deliverFormSubmission(
  submission: FormSubmission,
  options: { honeypot?: string; store?: SubmissionStore; provider?: EmailProvider } = {},
): Promise<FormSubmitResult> {
  return deliverStoredFormSubmission(submission, { honeypot: options.honeypot, store: options.store ?? defaultStore(), provider: options.provider ?? createBrevoAdapter() });
}
