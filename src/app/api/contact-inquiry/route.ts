import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { CONTACT_REASONS, validateContactInquiry, type ContactInquiryInput } from "@/lib/contact-inquiry";
import { deliverFormSubmission, isAllowedFormOrigin, isRateLimited } from "@/lib/forms/server";

const limited = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return NextResponse.json({ status: "invalid" }, { status: 415 });
  if (Number(request.headers.get("content-length") || "0") > 12_000) return NextResponse.json({ status: "invalid" }, { status: 413 });
  if (!isAllowedFormOrigin(request)) return NextResponse.json({ status: "invalid" }, { status: 403 });
  if (isRateLimited(request)) return NextResponse.json({ status: "invalid" }, { status: 429 });
  let body: Partial<ContactInquiryInput> & { honeypot?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ status: "invalid" }, { status: 400 }); }
  if (!isLocale(body.locale) || !CONTACT_REASONS.includes(body.reason as typeof CONTACT_REASONS[number])) return NextResponse.json({ status: "invalid" }, { status: 400 });
  const input: ContactInquiryInput = { firstName: limited(body.firstName, 80), lastName: limited(body.lastName, 80), email: limited(body.email, 254), phone: limited(body.phone, 40), reason: body.reason as ContactInquiryInput["reason"], message: limited(body.message, 3000), locale: body.locale };
  if (Object.keys(validateContactInquiry(input)).length) return NextResponse.json({ status: "invalid" }, { status: 400 });
  const result = await deliverFormSubmission({ formType: "contact", name: `${input.firstName} ${input.lastName}`, email: input.email, phone: input.phone || undefined, reason: input.reason, message: input.message, locale: input.locale, payload: {} }, { honeypot: String(body.honeypot ?? "") });
  return NextResponse.json(result);
}
