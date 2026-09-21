import { NextRequest, NextResponse } from "next/server";
import { VOLUNTEER_RELEASE_VERSION } from "@/content/volunteer-release";
import { isLocale } from "@/i18n/config";
import { validateVolunteerApplication, type VolunteerApplicationInput } from "@/lib/volunteer-application";
import { deliverFormSubmission, isAllowedFormOrigin, isRateLimited } from "@/lib/forms/server";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ status: "invalid" }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 20_000) return NextResponse.json({ status: "invalid" }, { status: 413 });
  if (!isAllowedFormOrigin(request)) {
    return NextResponse.json({ status: "invalid" }, { status: 403 });
  }
  if (isRateLimited(request)) return NextResponse.json({ status: "invalid" }, { status: 429 });
  let body: Partial<VolunteerApplicationInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
  if (!isLocale(body.locale) || body.releaseVersion !== VOLUNTEER_RELEASE_VERSION) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
  const input: VolunteerApplicationInput = {
    fullName: String(body.fullName ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    requestedStartDate: String(body.requestedStartDate ?? ""),
    numberOfDays: String(body.numberOfDays ?? ""),
    acceptedRelease: body.acceptedRelease === true,
    locale: body.locale,
    releaseVersion: body.releaseVersion,
  };
  if (Object.keys(validateVolunteerApplication(input)).length) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const result = await deliverFormSubmission({
    formType: "volunteer", name: input.fullName.trim(), email: input.email.trim(), phone: input.phone.trim(), locale: input.locale,
    message: `Requested start date: ${input.requestedStartDate}\nNumber of days: ${input.numberOfDays}\nRelease accepted: yes (${input.releaseVersion})`,
    payload: { requestedStartDate: input.requestedStartDate, numberOfDays: Number(input.numberOfDays), acceptedRelease: true, releaseVersion: input.releaseVersion },
  }, { honeypot: String(body.honeypot ?? "") });
  return NextResponse.json(result);
}
