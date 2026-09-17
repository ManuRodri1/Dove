import { NextRequest, NextResponse } from "next/server";
import { VOLUNTEER_RELEASE_VERSION } from "@/content/volunteer-release";
import { isLocale } from "@/i18n/config";
import { validateVolunteerApplication, type VolunteerApplicationInput } from "@/lib/volunteer-application";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ status: "invalid" }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 20_000) return NextResponse.json({ status: "invalid" }, { status: 413 });
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ status: "invalid" }, { status: 403 });
  }
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

  // TODO: CONNECT VERIFIED VOLUNTEER APPLICATION PROVIDER.
  // No submittedAt or acceptance record is created until a verified provider
  // securely accepts and stores the application.
  return NextResponse.json({ status: "unavailable" }, { status: 503 });
}
