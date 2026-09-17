import type { Locale } from "@/i18n/config";

/** Single destination registry. External destinations verified by the client. */
export const links = {
  home: (locale: Locale) => `/${locale}`,
  ourStory: (locale: Locale) => `/${locale}/our-story`,
  whatWeDo: (locale: Locale) => `/${locale}/what-we-do`,
  childSponsorship: (locale: Locale) => `/${locale}/child-sponsorship`,
  vocationalTraining: (locale: Locale) => `/${locale}/vocational-training-center`,
  donate: (locale: Locale) => `/${locale}/donate`,
  partnerships: (locale: Locale) => `/${locale}/partnerships`,
  volunteer: {
    page: (locale: Locale) => `/${locale}/volunteer`,
    guidelines: "https://www.doveyouthdevelopment.org/_files/ugd/0d11bb_cc829a2cbd5d43d7aea82cf4ce1525f4.pdf",
    legacyExperience: "https://www.doveyouthdevelopment.org/the-dove-experience",
  },
  travel: {
    page: (locale: Locale) => `/${locale}/travel-with-purpose`,
    legacyGroupTravel: "https://www.doveyouthdevelopment.org/grouptravel",
  },
  section: (locale: Locale, id: "pathway" | "experience" | "impact") => `/${locale}#${id}`,
  giving: {
    general: "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page",
    childSponsorship: "https://dovemissions.networkforgood.com/projects/30480-dove-missions-child-sponsorship",
    vocationalTraining: "https://dovemissions.networkforgood.com/projects/138886-dove-vocational-training-center",
  },
  contact: "mailto:executivedirector@doveyouthdevelopment.org",
  email: {
    executiveDirector: "mailto:executivedirector@doveyouthdevelopment.org",
    partnerships: "mailto:executivedirector@doveyouthdevelopment.org",
    childSponsorship: "mailto:childsponsorship@doveyouthdevelopment.org",
    inKindDonations: "mailto:vicky@doveyouthdevelopment.org",
    volunteer: "mailto:operations@doveyouthdevelopment.org",
    groupTravel: "mailto:executivedirector@doveyouthdevelopment.org",
  },
  stories: "https://www.doveyouthdevelopment.org/blog",
  // Linked by the legacy About page; retain the existing policy until replaced.
  privacy: "https://app.termly.io/policy-viewer/policy.html?policyUUID=5366d787-8175-44d5-93cf-a628b5303232",
} as const;

export function externalRel(href: string) {
  return /^https:\/\//.test(href) ? "external noopener noreferrer" : undefined;
}
