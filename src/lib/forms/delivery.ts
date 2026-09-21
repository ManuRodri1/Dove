import type { EmailProvider } from "./brevo";
import { recipientForSubmission } from "./recipients";
import { formNotification } from "./template";
import type { FormSubmission, FormSubmitResult } from "./types";

export type SubmissionStore = {
  insert(submission: FormSubmission & { recipient: string; receivedAt: string; status: "received" | "spam" }): Promise<{ id: string }>;
  update(id: string, status: "delivered" | "delivery_failed", details?: { error?: string; providerMessageId?: string }): Promise<void>;
};

export async function deliverStoredFormSubmission(
  submission: FormSubmission,
  options: { honeypot?: string; store: SubmissionStore; provider: EmailProvider },
): Promise<FormSubmitResult> {
  const recipient = recipientForSubmission(submission.formType, submission.reason);
  const receivedAt = new Date().toISOString();
  if (options.honeypot?.trim()) {
    await options.store.insert({ ...submission, recipient, receivedAt, status: "spam" });
    return { status: "spam" };
  }
  const stored = await options.store.insert({ ...submission, recipient, receivedAt, status: "received" });
  try {
    const notification = formNotification(submission, receivedAt);
    const delivery = await options.provider.send({ to: recipient, replyTo: submission.email, ...notification });
    await options.store.update(stored.id, "delivered", { providerMessageId: delivery.messageId });
    return { status: "delivered" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown delivery error.";
    try { await options.store.update(stored.id, "delivery_failed", { error: message }); } catch { /* Preserve the original provider failure. */ }
    return { status: "delivery_failed" };
  }
}
