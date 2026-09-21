import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { validatePartnershipInquiry, type PartnershipInquiryInput } from "@/lib/partnership-inquiry";
import { deliverFormSubmission, isAllowedFormOrigin, isRateLimited } from "@/lib/forms/server";

function limited(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ status: "invalid" }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 30_000) return NextResponse.json({ status: "invalid" }, { status: 413 });
  if (!isAllowedFormOrigin(request)) return NextResponse.json({ status: "invalid" }, { status: 403 });
  if (isRateLimited(request)) return NextResponse.json({ status: "invalid" }, { status: 429 });
  let body: Partial<PartnershipInquiryInput>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ status: "invalid" }, { status: 400 }); }
  if (!isLocale(body.locale)) return NextResponse.json({ status: "invalid" }, { status: 400 });
  const input: PartnershipInquiryInput = {
    fullName: limited(body.fullName, 160),
    workEmail: limited(body.workEmail, 254),
    phone: limited(body.phone, 40),
    organizationName: limited(body.organizationName, 180),
    website: limited(body.website, 300),
    role: limited(body.role, 160),
    interest: limited(body.interest, 100),
    message: limited(body.message, 3000),
    referral: limited(body.referral, 500),
    locale: body.locale,
  };
  if (Object.keys(validatePartnershipInquiry(input)).length) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const result = await deliverFormSubmission({
    formType: "partnership", name: input.fullName, email: input.workEmail, phone: input.phone || undefined, organization: input.organizationName,
    reason: input.interest, message: [input.message, `Website: ${input.website || "Not provided"}`, `Role: ${input.role || "Not provided"}`, `Referral: ${input.referral || "Not provided"}`].join("\n\n"), locale: input.locale,
    payload: { website: input.website, role: input.role, interest: input.interest, referral: input.referral },
  }, { honeypot: String(body.honeypot ?? "") });
  return NextResponse.json(result);
}
