export type CampaignLifecycle = "upcoming" | "active" | "ended";
export type CampaignStateInput = { startDate: string | null; endDate: string | null; lifecycleOverride?: CampaignLifecycle | null };

export function deriveCampaignLifecycle(campaign: CampaignStateInput, now = new Date()): CampaignLifecycle {
  if (campaign.lifecycleOverride) return campaign.lifecycleOverride;
  const today = now.toISOString().slice(0, 10);
  if (campaign.startDate && campaign.startDate > today) return "upcoming";
  if (campaign.endDate && campaign.endDate < today) return "ended";
  return "active";
}

export function canDisplayProgress(campaign: { raisedAmount: number | null; progressSource: string }) {
  return campaign.raisedAmount !== null && campaign.progressSource !== "none";
}

export function comparePastCampaigns<T extends { endDate: string | null; startDate: string | null; publishedAt: string; createdAt: string }>(a: T, b: T) {
  const desc = (left: string | null, right: string | null) => (right ?? "").localeCompare(left ?? "");
  return desc(a.endDate, b.endDate) || desc(a.startDate, b.startDate) || desc(a.publishedAt, b.publishedAt) || desc(a.createdAt, b.createdAt);
}
