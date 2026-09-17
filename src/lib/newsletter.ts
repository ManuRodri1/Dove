export type NewsletterResult = { status: "unavailable" | "invalid" | "subscribed" | "error" };
export interface NewsletterProvider {
  subscribe(input: { email: string; locale: "en" | "es" }): Promise<NewsletterResult>;
}
// TODO: CONNECT VERIFIED NEWSLETTER PROVIDER
// No endpoint, storage or network request until the provider and consent flow are verified.
export async function submitNewsletter(input: { email: string; locale: "en" | "es" }): Promise<NewsletterResult> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) return { status: "invalid" };
  return { status: "unavailable" };
}
