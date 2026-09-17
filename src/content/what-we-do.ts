import "server-only";
import type { Locale } from "@/i18n/config";
import { whatWeDoEn } from "@/i18n/messages/what-we-do.en";
import { whatWeDoEs } from "@/i18n/messages/what-we-do.es";
import { doveMedia } from "./dove-media";
import { links } from "./links";

export function getWhatWeDo(locale: Locale) {
  const copy = locale === "es" ? whatWeDoEs : whatWeDoEn;
  const media = [
    doveMedia.whatWeDo.youth,
    doveMedia.whatWeDo.education,
    null,
    doveMedia.whatWeDo.vocational,
    doveMedia.whatWeDo.community,
  ];
  const destinations = [
    links.childSponsorship(locale),
    links.donate(locale),
    links.vocationalTraining(locale),
    links.vocationalTraining(locale),
    links.donate(locale),
  ];
  return {
    ...copy,
    locale,
    heroImage: { ...doveMedia.whatWeDo.hero, alt: copy.hero.imageAlt },
    heroLinks: {
      primary: { label: copy.hero.primary, href: "#program-areas" },
      secondary: { label: copy.hero.secondary, href: "#dove-pathway" },
    },
    programs: {
      ...copy.programs,
      items: copy.programs.items.map((item, index) => ({
        ...item,
        href: destinations[index],
        image: media[index] ? { ...media[index]!, alt: item.imageAlt ?? media[index]!.alt } : null,
      })),
    },
    outcomeLink: { label: copy.outcome.cta, href: links.stories },
    closingLinks: {
      primary: { label: copy.closing.primary, href: links.donate(locale) },
      secondary: { label: copy.closing.secondary, href: links.volunteer.page(locale) },
    },
  };
}

export type WhatWeDoContent = ReturnType<typeof getWhatWeDo>;
