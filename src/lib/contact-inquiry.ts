import type { Locale } from "@/i18n/config";

export const CONTACT_REASONS = ["general", "programs", "volunteer", "travel", "sponsorship", "partnership", "donation", "other"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

export type ContactInquiryInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: ContactReason;
  message: string;
  locale: Locale;
};

export type ContactInquiryErrors = Partial<Record<"firstName" | "lastName" | "email" | "message", true>>;
export type ContactInquiryResult = { status: "accepted" | "invalid" | "error" };

export function validateContactInquiry(input: ContactInquiryInput): ContactInquiryErrors {
  const errors: ContactInquiryErrors = {};
  if (input.firstName.trim().length < 1 || input.firstName.length > 80) errors.firstName = true;
  if (input.lastName.trim().length < 1 || input.lastName.length > 80) errors.lastName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) errors.email = true;
  if (input.message.trim().length < 2 || input.message.length > 3000) errors.message = true;
  return errors;
}

export async function submitContactInquiry(input: ContactInquiryInput, honeypot = ""): Promise<ContactInquiryResult> {
  if (Object.keys(validateContactInquiry(input)).length) return { status: "invalid" };
  try {
    const response = await fetch("/api/contact-inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...input, honeypot }) });
    if (response.status === 400) return { status: "invalid" };
    if (!response.ok) return { status: "error" };
    const result = await response.json() as { status?: string };
    return result.status === "delivered" || result.status === "spam" ? { status: "accepted" } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}
