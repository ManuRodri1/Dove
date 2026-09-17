import "server-only";
import type { Locale } from "@/i18n/config";
import { partnershipsEn } from "@/i18n/messages/partnerships.en";
import { partnershipsEs } from "@/i18n/messages/partnerships.es";
import { doveMedia } from "./dove-media";
import { links } from "./links";
import { getApprovedFeaturedPartners, historicalPartnerships } from "./partners";

export const partnershipTypes = [
  "program",
  "workforce",
  "giving",
  "team",
  "campaign",
  "resources",
] as const;

// TODO: CLIENT CONFIRM PARTNERSHIP FORM RECIPIENT.
export const partnershipInquiryRecipient = links.email.partnerships;

export function getPartnerships(locale: Locale) {
  const copy = locale === "es" ? partnershipsEs : partnershipsEn;
  const destinations = [
    links.whatWeDo(locale),
    links.vocationalTraining(locale),
    links.donate(locale),
    links.travel.page(locale),
    "#partner-inquiry",
    "#partner-inquiry",
  ];
  return {
    ...copy,
    locale,
    media: {
      hero: { ...doveMedia.partnerships.hero, alt: copy.hero.imageAlt },
      workforce: { ...doveMedia.partnerships.workforce, alt: copy.workforce.imageAlt },
    },
    heroLinks: {
      primary: { label: copy.hero.primary, href: "#partner-inquiry" },
      secondary: { label: copy.hero.secondary, href: "#ways-to-partner" },
    },
    ways: {
      ...copy.ways,
      items: copy.ways.items.map((item, index) => ({ ...item, href: destinations[index] })),
    },
    workforceLink: { label: copy.workforce.cta, href: links.vocationalTraining(locale) },
    communityLink: { label: copy.community.bridgeCta, href: links.travel.page(locale) },
    inquiryContact: { label: copy.inquiry.fallback, href: partnershipInquiryRecipient },
    matchingLink: { label: copy.matching.cta, href: links.donate(locale) },
    approvedFeaturedPartners: getApprovedFeaturedPartners(),
    historicalPartnerships,
  };
}

export type PartnershipsContent = ReturnType<typeof getPartnerships>;
