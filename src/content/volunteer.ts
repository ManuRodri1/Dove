import "server-only";
import type { Locale } from "@/i18n/config";
import { volunteerEn } from "@/i18n/messages/volunteer.en";
import { volunteerEs } from "@/i18n/messages/volunteer.es";
import { doveMedia } from "./dove-media";
import { links } from "./links";
import { volunteerRelease } from "./volunteer-release";

export function getVolunteer(locale: Locale) {
  const copy = locale === "es" ? volunteerEs : volunteerEn;
  return {
    ...copy,
    locale,
    media: doveMedia.volunteer,
    heroLinks: {
      primary: { label: copy.hero.primary, href: "#application" },
      secondary: { label: copy.hero.secondary, href: "#day-with-dove" },
    },
    prepareLinks: {
      guidelines: { label: copy.prepare.guidelines, href: links.volunteer.guidelines },
      email: { label: copy.prepare.email, href: links.email.volunteer },
    },
    startLink: { label: copy.start.cta, href: "#application" },
    groupLink: { label: copy.group.cta, href: links.travel.page(locale) },
    contactLink: { label: copy.application.contact, href: links.email.volunteer },
    release: volunteerRelease,
  };
}

export type VolunteerContent = ReturnType<typeof getVolunteer>;
