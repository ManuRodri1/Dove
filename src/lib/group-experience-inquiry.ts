import type { Locale } from "@/i18n/config";

export type GroupExperienceInquiryInput = {
  fullName: string;
  email: string;
  phone: string;
  organizationName: string;
  groupType: string;
  estimatedGroupSize: string;
  preferredStartDate: string;
  alternateDates: string;
  approximateDuration: string;
  aboutGroup: string;
  skillsInterests: string;
  discussLodging: boolean;
  discussTransportation: boolean;
  discussExcursions: boolean;
  locale: Locale;
  honeypot?: string;
};

export type GroupInquiryField = "fullName" | "email" | "estimatedGroupSize" | "preferredStartDate";
export type GroupInquiryErrors = Partial<Record<GroupInquiryField, true>>;
export type GroupInquiryResult = { status: "accepted" | "unavailable" | "invalid" | "error" };

export function validateGroupExperienceInquiry(input: GroupExperienceInquiryInput): GroupInquiryErrors {
  const errors: GroupInquiryErrors = {};
  if (input.fullName.trim().length < 2 || input.fullName.length > 160) errors.fullName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) errors.email = true;
  const size = Number(input.estimatedGroupSize);
  if (!Number.isInteger(size) || size < 1) errors.estimatedGroupSize = true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.preferredStartDate)) errors.preferredStartDate = true;
  return errors;
}

export async function submitGroupExperienceInquiry(input: GroupExperienceInquiryInput): Promise<GroupInquiryResult> {
  if (Object.keys(validateGroupExperienceInquiry(input)).length) return { status: "invalid" };
  try {
    const response = await fetch("/api/group-experience-inquiry", {
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
