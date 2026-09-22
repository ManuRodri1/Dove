import type { Locale } from "@/i18n/config";

const mapQuery = encodeURIComponent("Dove Youth Development, Puerto Plata, Dominican Republic");

/** Single destination registry. External destinations verified by the client. */
export const links = {
  home: (locale: Locale) => `/${locale}`,
  ourStory: (locale: Locale) => `/${locale}/our-story`,
  ourTeam: (locale: Locale) => `/${locale}/our-team`,
  whatWeDo: (locale: Locale) => `/${locale}/what-we-do`,
  childSponsorship: (locale: Locale) => `/${locale}/child-sponsorship`,
  vocationalTraining: (locale: Locale) => `/${locale}/vocational-training-center`,
  donate: (locale: Locale) => `/${locale}/donate`,
  partnerships: (locale: Locale) => `/${locale}/partnerships`,
  ourImpact: (locale: Locale) => `/${locale}/our-impact`,
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
  contact: (locale: Locale) => "/" + locale + "/contact",
  phone: {
    dominicanRepublic: "tel:+18096764071",
    unitedStates: "tel:+16124425974",
  },
  location: {
    label: "Puerto Plata, Dominican Republic",
    query: "Dove Youth Development, Puerto Plata, Dominican Republic",
    embed: "https://www.google.com/maps?q=" + mapQuery + "&output=embed",
    directions: "https://www.google.com/maps/search/?api=1&query=" + mapQuery,
  },
  social: {
    instagram: "https://instagram.com/dove_youth_development",
    twitter: "https://twitter.com/dovemissionsorg",
    facebook: "https://m.facebook.com/doveyouthdevelopment/",
    linkedin: "https://www.linkedin.com/company/doveyouthdevelopment/",
    tripadvisor: "https://www.tripadvisor.com/Attraction_Review-g147290-d2649431-Reviews-Dove_Youth_Development-Puerto_Plata_Puerto_Plata_Province_Dominican_Republic.html",
    tiktok: "https://www.tiktok.com/@doveyouthdevelopment",
  },
  email: {
    executiveDirector: "mailto:executivedirector@doveyouthdevelopment.org",
    partnerships: "mailto:executivedirector@doveyouthdevelopment.org",
    childSponsorship: "mailto:childsponsorship@doveyouthdevelopment.org",
    inKindDonations: "mailto:vicky@doveyouthdevelopment.org",
    volunteer: "mailto:operations@doveyouthdevelopment.org",
    groupTravel: "mailto:executivedirector@doveyouthdevelopment.org",
  },
  stories: (locale: Locale) => `/${locale}/stories`,
  campaigns: (locale: Locale) => `/${locale}/campaigns`,
  privacy: (locale: Locale) => `/${locale}/privacy`,
  terms: (locale: Locale) => `/${locale}/terms`,
} as const;

export function externalRel(href: string) {
  return /^https:\/\//.test(href) ? "external noopener noreferrer" : undefined;
}
