import type { Locale } from "@/i18n/config";

export type PartnershipInquiryInput = {
  fullName: string;
  workEmail: string;
  phone: string;
  organizationName: string;
  website: string;
  role: string;
  interest: string;
  message: string;
  referral: string;
  locale: Locale;
  honeypot?: string;
};

export type PartnershipInquiryField = "fullName" | "workEmail" | "organizationName" | "interest" | "message";
export type PartnershipInquiryErrors = Partial<Record<PartnershipInquiryField, true>>;
export type PartnershipInquiryResult = { status: "accepted" | "unavailable" | "invalid" | "error" };

export function validatePartnershipInquiry(input: PartnershipInquiryInput): PartnershipInquiryErrors {
  const errors: PartnershipInquiryErrors = {};
  if (input.fullName.trim().length < 2 || input.fullName.length > 160) errors.fullName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.workEmail.trim()) || input.workEmail.length > 254) errors.workEmail = true;
  if (input.organizationName.trim().length < 2 || input.organizationName.length > 180) errors.organizationName = true;
  if (input.interest.trim().length < 2 || input.interest.length > 100) errors.interest = true;
  if (input.message.trim().length < 10 || input.message.length > 3000) errors.message = true;
  return errors;
}

export async function submitPartnershipInquiry(input: PartnershipInquiryInput): Promise<PartnershipInquiryResult> {
  if (Object.keys(validatePartnershipInquiry(input)).length) return { status: "invalid" };
  try {
    const response = await fetch("/api/partnership-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (response.status === 400) return { status: "invalid" };
    if (!response.ok) return { status: "error" };
    const result = await response.json() as { status?: string };
    return result.status === "delivered" || result.status === "spam" ? { status: "accepted" } : { status: "error" };
  } catch {
    return { status: "unavailable" };
  }
}
