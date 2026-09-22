import { NextRequest, NextResponse } from "next/server";
import { detectLocale, isLocale, localeCookie } from "@/i18n/config";
import { legacyRedirects } from "@/content/redirects";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const segment = url.pathname.split("/")[1];

  // Bypass admin, api, and post routes from locale rewriting
  if (segment === "admin" || segment === "api" || segment === "post") {
    return NextResponse.next();
  }

  const urlLocale = isLocale(segment) ? segment : undefined;
  // Only trust the hosting geo signal when running on that infrastructure.
  const country = process.env.VERCEL ? request.headers.get("x-vercel-ip-country") ?? "" : "";
  const locale = detectLocale(request.cookies.get(localeCookie)?.value, urlLocale,
    request.headers.get("accept-language") ?? "", country);
  const legacyDestination = legacyRedirects[url.pathname.replace(/\/$/, "") || "/"];
  if (legacyDestination) {
    const destination = legacyDestination(locale);
    const [pathname, hash] = destination.split("#");
    url.pathname = pathname;
    url.hash = hash ? `#${hash}` : "";
    const response = NextResponse.redirect(url, 308);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie, Accept-Language");
    return response;
  }
  if (!urlLocale || urlLocale !== locale) {
    url.pathname = urlLocale ? url.pathname.replace(/^\/(en|es)(?=\/|$)/, `/${locale}`)
      : `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
    const response = NextResponse.redirect(url, 307);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie, Accept-Language");
    return response;
  }
  const headers = new Headers(request.headers);
  headers.set("x-dove-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/",
    "/our-story",
    "/our-team",
    "/what-we-do",
    "/child-sponsorship",
    "/vocational-training-center",
    "/volunteer",
    "/travel-with-purpose",
    "/partnerships",
    "/our-impact",
    "/stories",
    "/stories/:path*",
    "/campaigns",
    "/campaigns/:path*",
    "/donate",
    "/contact",
    "/privacy",
    "/terms",
    "/dove-board",
    "/the-dove-experience",
    "/volunteer-release",
    "/grouptravel",
    "/post/:path*",
    "/en/:path*",
    "/es/:path*",
  ],
};
