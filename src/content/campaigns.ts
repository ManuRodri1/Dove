import "server-only";
import type { Locale } from "@/i18n/config";

export type CampaignEntry = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  href: string;
  status: "draft" | "active" | "completed" | "archived";
  verified: boolean;
  startsAt?: string;
  endsAt?: string;
};

// No client-verified active campaign is available for this milestone.
// Climb With Purpose 2026 remains historical/archived until the client says otherwise.
const campaigns: CampaignEntry[] = [];

export function getActiveCampaigns(locale: Locale, now = new Date()) {
  return campaigns
    .filter((campaign) => campaign.locale === locale && campaign.verified && campaign.status === "active")
    .filter((campaign) => !campaign.startsAt || new Date(campaign.startsAt) <= now)
    .filter((campaign) => !campaign.endsAt || new Date(campaign.endsAt) >= now)
    .sort((a, b) => a.title.localeCompare(b.title));
}
