import "server-only";
import type { Locale } from "@/i18n/config";
import { travelWithPurposeEn } from "@/i18n/messages/travel-with-purpose.en";
import { travelWithPurposeEs } from "@/i18n/messages/travel-with-purpose.es";
import { doveMedia } from "./dove-media";
import { links } from "./links";

// TODO: CLIENT CONFIRM CURRENT GROUP LOGISTICS OFFERING.
export const groupLogisticsClientConfirmed = false;
// TODO: CLIENT CONFIRM GROUP TRAVEL INQUIRIES SHOULD CONTINUE TO EXECUTIVE DIRECTOR.
export const groupTravelRecipientClientConfirmed = false;
// TODO: CLIENT CONFIRM CURRENT GROUP EXPERIENCE PRICING / MINIMUM DONATION MODEL.
export const groupExperiencePricing = null;

export function getTravelWithPurpose(locale: Locale) {
  const copy = locale === "es" ? travelWithPurposeEs : travelWithPurposeEn;
  return {
    ...copy,
    locale,
    media: doveMedia.travel,
    heroLinks: {
      primary: { label: copy.hero.primary, href: "#group-inquiry" },
      secondary: { label: copy.hero.secondary, href: "#experience" },
    },
    planningLinks: {
      guidelines: { label: copy.planning.guidelines, href: links.volunteer.guidelines },
      participant: { label: copy.planning.participant, href: `${links.volunteer.page(locale)}#application` },
    },
    inquiryContact: { label: copy.inquiry.contact, href: links.email.groupTravel },
    individualLink: { label: copy.individual.cta, href: links.volunteer.page(locale) },
  };
}

export type TravelWithPurposeContent = ReturnType<typeof getTravelWithPurpose>;
