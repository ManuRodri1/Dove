import "server-only";
import type { Locale } from "@/i18n/config";
import { vocationalTrainingEn } from "@/i18n/messages/vocational-training.en";
import { vocationalTrainingEs } from "@/i18n/messages/vocational-training.es";
import { doveMedia } from "./dove-media";
import { links } from "./links";

// TODO: VERIFY YOUTH EMPLOYMENT STATISTIC before publishing any national percentage.
// TODO: CLIENT CONFIRM CURRENT VOCATIONAL FUNDING LEVELS before rendering these historical amounts.
export const legacyFundingLevels = {
  annualCenter: 50000,
  classMonthly: 1050,
  teacherMonthly: 400,
  workplaceVisitMonthly: 150,
  groceriesMonthly: 600,
} as const;

// LEGACY DOVE OUTCOME CONTENT — CLIENT APPROVED SOURCE.
// These examples describe wider program history and are not attributed to one cohort.
export function getVocationalTraining(locale: Locale) {
  const copy = locale === "es" ? vocationalTrainingEs : vocationalTrainingEn;
  return {
    ...copy,
    locale,
    donationLink: { label: copy.hero.primary, href: links.giving.vocationalTraining },
    supportLink: { label: copy.support.primary, href: links.giving.vocationalTraining },
    finalDonationLink: { label: copy.final.primary, href: links.giving.vocationalTraining },
    partnerLink: { label: copy.support.partner, href: links.partnerships(locale) },
    finalPartnerLink: { label: copy.final.secondary, href: links.partnerships(locale) },
    storyLink: { label: copy.origin.link, href: links.ourStory(locale) },
    heroImage: { ...doveMedia.vocational.primary, alt: copy.hero.imageAlt },
    pathwayImage: { ...doveMedia.vocational.programGroup, alt: copy.pathways.imageAlt },
    originImage: { ...doveMedia.vocational.centerCommunity, alt: copy.origin.imageAlt },
    founderImage: { ...doveMedia.vocational.founder, alt: copy.founder.imageAlt },
  };
}

export type VocationalTrainingContent = ReturnType<typeof getVocationalTraining>;
