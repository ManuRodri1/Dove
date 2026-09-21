import type { Locale } from "@/i18n/config";
import type { Json } from "@/lib/supabase/database.types";

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
  payload: Record<string, Json | undefined>;
};

/** The only outcomes public form routes may disclose to visitors. */
export type FormSubmitResult = { status: "delivered" | "delivery_failed" | "spam" | "invalid" };
