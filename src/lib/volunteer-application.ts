import { VOLUNTEER_RELEASE_VERSION } from "@/content/volunteer-release";
import type { Locale } from "@/i18n/config";

export type VolunteerApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  requestedStartDate: string;
  numberOfDays: string;
  acceptedRelease: boolean;
  locale: Locale;
  releaseVersion: typeof VOLUNTEER_RELEASE_VERSION;
  honeypot?: string;
};

export type VolunteerField = keyof Pick<VolunteerApplicationInput,
  "fullName" | "email" | "phone" | "requestedStartDate" | "numberOfDays" | "acceptedRelease">;
export type VolunteerErrors = Partial<Record<VolunteerField, true>>;
export type VolunteerSubmitResult = { status: "accepted" | "unavailable" | "invalid" | "error" };

export function validateVolunteerApplication(input: VolunteerApplicationInput): VolunteerErrors {
  const errors: VolunteerErrors = {};
  if (input.fullName.trim().length < 2 || input.fullName.length > 160) errors.fullName = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) errors.email = true;
  if (input.phone.trim().length < 7 || input.phone.length > 40) errors.phone = true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.requestedStartDate)) errors.requestedStartDate = true;
  const days = Number(input.numberOfDays);
  if (!Number.isInteger(days) || days < 1) errors.numberOfDays = true;
  if (!input.acceptedRelease) errors.acceptedRelease = true;
  return errors;
}

export async function submitVolunteerApplication(input: VolunteerApplicationInput): Promise<VolunteerSubmitResult> {
  if (Object.keys(validateVolunteerApplication(input)).length) return { status: "invalid" };
  try {
    const response = await fetch("/api/volunteer-application", {
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
