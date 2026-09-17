import type { DoveImage } from "./dove-media";

export type Partner = {
  id: string;
  name: string;
  logo: DoveImage | null;
  url: string | null;
  relationshipType: "organizational" | "historical-support" | "legacy-collaboration";
  current: boolean;
  featured: boolean;
  clientApproved: boolean;
  order: number;
  summary: string;
};

export const verifiedPartners: readonly Partner[] = [
  {
    id: "lifestyle-holidays",
    name: "Lifestyle Holidays Hotels and Resorts",
    logo: null,
    url: null,
    relationshipType: "organizational",
    current: true,
    featured: true,
    clientApproved: false,
    order: 1,
    summary: "Publicly described long-term support, school-supply participation and a visit to Dove’s Vocational Training Center in September 2026.",
  },
];

export const historicalPartnerships = {
  rotary: {
    id: "rotary-support",
    name: "Ronkonkoma Rotary and Rotary fundraising efforts",
    status: "historical",
    clientConfirmCurrentStatus: true,
  },
  happyDolphins: {
    id: "happy-dolphins",
    name: "Happy Dolphins",
    status: "legacy-partnership",
    clientConfirmCurrentStatus: true,
  },
} as const;

// TODO: CLIENT CONFIRM LIFESTYLE HOLIDAYS PARTNER SHOWCASE / PROVIDE APPROVED LOGO OR PHOTO.
// TODO: CLIENT CONFIRM CURRENT STATUS OF ROTARY AND HAPPY DOLPHINS RELATIONSHIPS.
export function getApprovedFeaturedPartners() {
  return verifiedPartners.filter((partner) => partner.current && partner.featured && partner.clientApproved);
}
