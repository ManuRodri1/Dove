import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { validateGroupExperienceInquiry, type GroupExperienceInquiryInput } from "@/lib/group-experience-inquiry";
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

  const message = [
    `Group type: ${input.groupType || "Not provided"}`, `Estimated group size: ${input.estimatedGroupSize}`,
    `Preferred start date: ${input.preferredStartDate}`, `Alternate dates: ${input.alternateDates || "Not provided"}`,
    `Approximate duration: ${input.approximateDuration || "Not provided"}`, `About group: ${input.aboutGroup || "Not provided"}`,
    `Skills/interests: ${input.skillsInterests || "Not provided"}`,
    `Planning interests: ${[input.discussLodging && "lodging", input.discussTransportation && "transportation", input.discussExcursions && "excursions"].filter(Boolean).join(", ") || "None selected"}`,
  ].join("\n");
  const result = await deliverFormSubmission({
    formType: "travel", name: input.fullName, email: input.email, phone: input.phone || undefined, organization: input.organizationName || undefined,
    message, locale: input.locale, payload: { groupType: input.groupType, estimatedGroupSize: Number(input.estimatedGroupSize), preferredStartDate: input.preferredStartDate, alternateDates: input.alternateDates, approximateDuration: input.approximateDuration, aboutGroup: input.aboutGroup, skillsInterests: input.skillsInterests, discussLodging: input.discussLodging, discussTransportation: input.discussTransportation, discussExcursions: input.discussExcursions },
  }, { honeypot: String(body.honeypot ?? "") });
  return NextResponse.json(result);
}
