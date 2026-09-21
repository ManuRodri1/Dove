import "server-only";

export type TransactionalEmail = {
  to: string;
  replyTo: string;
  subject: string;
  htmlContent: string;
  textContent: string;
};

export type EmailProvider = { send(email: TransactionalEmail): Promise<{ messageId?: string }> };

export function createBrevoAdapter(fetcher: typeof fetch = fetch): EmailProvider {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.FORM_FROM_EMAIL;
  const senderName = process.env.FORM_FROM_NAME;
  if (!apiKey || !senderEmail || !senderName) {
    throw new Error("Brevo is not configured. Set BREVO_API_KEY, FORM_FROM_EMAIL, and FORM_FROM_NAME.");
  }

  return {
    async send(email) {
      const response = await fetcher("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { email: senderEmail, name: senderName },
          to: [{ email: email.to }],
          replyTo: { email: email.replyTo },
          subject: email.subject,
          htmlContent: email.htmlContent,
          textContent: email.textContent,
        }),
      });
      if (!response.ok) throw new Error(`Brevo delivery failed (${response.status}).`);
      const result = await response.json().catch(() => ({})) as { messageId?: string };
      return { messageId: result.messageId };
    },
  };
}
