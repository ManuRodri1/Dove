import type { Locale } from "@/i18n/config";

export const FORM_TYPES = ["contact", "volunteer", "travel", "partnership"] as const;
export type FormType = (typeof FORM_TYPES)[number];
export type FormDeliveryStatus = "received" | "delivered" | "delivery_failed" | "spam" | "archived";

export type FormSubmission = {
  formType: FormType;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  reason?: string;
  message?: string;
  locale: Locale;
  payload: Record<string, unknown>;
};

export type FormSubmitResult = { status: "delivered" | "delivery_failed" | "spam" | "invalid" };
