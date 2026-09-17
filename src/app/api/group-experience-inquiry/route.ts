import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { validateGroupExperienceInquiry, type GroupExperienceInquiryInput } from "@/lib/group-experience-inquiry";

function limited(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ status: "invalid" }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 30_000) return NextResponse.json({ status: "invalid" }, { status: 413 });
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ status: "invalid" }, { status: 403 });
  let body: Partial<GroupExperienceInquiryInput>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ status: "invalid" }, { status: 400 }); }
  if (!isLocale(body.locale)) return NextResponse.json({ status: "invalid" }, { status: 400 });
  const input: GroupExperienceInquiryInput = {
    fullName: limited(body.fullName, 160),
    email: limited(body.email, 254),
    phone: limited(body.phone, 40),
    organizationName: limited(body.organizationName, 180),
    groupType: limited(body.groupType, 80),
    estimatedGroupSize: limited(body.estimatedGroupSize, 8),
    preferredStartDate: limited(body.preferredStartDate, 10),
    alternateDates: limited(body.alternateDates, 240),
    approximateDuration: limited(body.approximateDuration, 120),
    aboutGroup: limited(body.aboutGroup, 2000),
    skillsInterests: limited(body.skillsInterests, 2000),
    discussLodging: body.discussLodging === true,
    discussTransportation: body.discussTransportation === true,
    discussExcursions: body.discussExcursions === true,
    locale: body.locale,
  };
  if (Object.keys(validateGroupExperienceInquiry(input)).length) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  // TODO: CONNECT VERIFIED GROUP INQUIRY PROVIDER.
  // Intended recipient: executivedirector@doveyouthdevelopment.org
  // No submittedAt or delivery record is created until a verified provider accepts it.
  return NextResponse.json({ status: "unavailable" }, { status: 503 });
}
