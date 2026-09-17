import "server-only";
import type { Locale } from "@/i18n/config";
import { donateEn } from "@/i18n/messages/donate.en";
import { donateEs } from "@/i18n/messages/donate.es";
import { getActiveCampaigns } from "./campaigns";
import { doveMedia } from "./dove-media";
import { links } from "./links";

export const legacyGivingPrograms = {
  privateSchoolSponsors: { status: "client-confirm" },
  supportersCircle: { amountRangeMonthly: "100-500", status: "client-confirm" },
  sustainersCircle: { amountRangeMonthly: "500-2000", status: "client-confirm" },
} as const;

export const inKindDonations = {
  contact: links.email.inKindDonations,
  status: "client-confirm",
  // TODO: CLIENT CONFIRM VICKY CONTACT IS CURRENT
  // TODO: CLIENT PROVIDE / CONFIRM CURRENT WISH LIST
} as const;

export const mailDonation = {
  payee: "Dove Missions",
  address: "1400 Van Buren St, Suite 200, Minneapolis, MN 55413",
  status: "client-confirm",
  // TODO: CLIENT CONFIRM CURRENT CHECK MAILING ADDRESS
} as const;

export const legal = {
  donationTaxStatus: {
    status: "client-confirm",
    // TODO: CLIENT CONFIRM FINAL U.S. CHARITY / TAX-RECEIPT WORDING
  },
  candidSeal: {
    status: "client-confirm",
    // TODO: CLIENT CONFIRM CURRENT CANDID STATUS / PROVIDE 2026 ASSET
  },
} as const;

export type DonationOption = {
  id: "general" | "childSponsorship" | "vocationalTraining" | "currentCampaign" | "partnership";
  title: string;
  description: string;
  label: string;
  cta: string;
  type: "general" | "sponsorship" | "program" | "campaign" | "partnership";
  linkKey: string;
  href: string;
  amountLabel?: string;
  status: "active" | "client-confirm";
  featured: boolean;
  external: boolean;
  order: number;
};

export function getDonate(locale: Locale) {
  const copy = locale === "es" ? donateEs : donateEn;
  const activeCampaigns = getActiveCampaigns(locale);
  const options: DonationOption[] = [
    {
      id: "general", ...copy.pathways.options.general, type: "general", linkKey: "links.giving.general",
      href: links.giving.general, status: "active", featured: true, external: true, order: 1,
    },
    {
      id: "childSponsorship", ...copy.pathways.options.childSponsorship, type: "sponsorship",
      linkKey: "links.giving.childSponsorship", href: links.giving.childSponsorship,
      amountLabel: copy.pathways.options.childSponsorship.label, status: "active", featured: false, external: true, order: 2,
    },
    {
      id: "vocationalTraining", ...copy.pathways.options.vocationalTraining, type: "program",
      linkKey: "links.giving.vocationalTraining", href: links.giving.vocationalTraining,
      status: "active", featured: false, external: true, order: 3,
    },
    {
      id: "partnership", ...copy.pathways.options.partnership, type: "partnership",
      linkKey: "links.partnerships", href: links.partnerships(locale),
      status: "active", featured: false, external: false, order: 5,
    },
  ];

  for (const campaign of activeCampaigns) {
    options.push({
      id: "currentCampaign", label: locale === "es" ? "Campaña activa" : "Active campaign",
      title: campaign.title, description: campaign.description,
      cta: locale === "es" ? "Apoya esta campaña" : "Support this campaign",
      type: "campaign", linkKey: `campaigns.${campaign.id}`, href: campaign.href,
      status: "active", featured: false, external: true, order: 4,
    });
  }

  return {
    ...copy,
    locale,
    video: doveMedia.donate.hero,
    options: options.sort((a, b) => a.order - b.order),
    heroPrimary: { label: copy.hero.primary, href: links.giving.general },
    heroSecondary: { label: copy.hero.secondary, href: "#giving-pathways" },
    recurringLink: { label: copy.otherWays.recurring.cta, href: links.giving.general },
    tributeLink: { label: copy.otherWays.tribute.cta, href: links.giving.general },
    partnershipLink: { label: copy.partnership.cta, href: links.partnerships(locale) },
    finalGeneralLink: { label: copy.final.primary, href: links.giving.general },
    finalSponsorLink: { label: copy.final.secondary, href: links.giving.childSponsorship },
  };
}

export type DonateContent = ReturnType<typeof getDonate>;
