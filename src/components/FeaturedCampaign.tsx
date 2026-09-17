import { type Campaign, isDevelopment } from "@/content/home";
import { Action, Photo, SectionHeading } from "./ui";

export default function FeaturedCampaign({
  campaign,
}: {
  campaign: Campaign | null;
}) {
  if (
    !campaign ||
    ((!campaign.verified || campaign.status === "development") &&
      !isDevelopment)
  )
    return null;
  const verifiedProgress =
    campaign.verified && campaign.status !== "development";
  const progress = verifiedProgress
    ? (campaign.progress ??
      (campaign.goal && campaign.raised != null
        ? (campaign.raised / campaign.goal) * 100
        : undefined))
    : undefined;
  const validProgress =
    typeof progress === "number" &&
    Number.isFinite(progress) &&
    progress >= 0 &&
    progress <= 100;
  return (
    <section
      className="section section--paper"
      aria-labelledby="campaign-heading"
      data-development={!campaign.verified || undefined}
    >
      <div className="container campaign">
        <Photo media={campaign.image} />
        <div className="campaign-copy">
          <SectionHeading
            eyebrow={campaign.category}
            title={campaign.title}
            description={campaign.description}
            id="campaign-heading"
          />
          <p className="campaign-status">
            {campaign.status === "development"
              ? "Development placeholder · Not an active campaign"
              : campaign.status === "active"
                ? "Active campaign"
                : "Campaign completed"}
          </p>
          {validProgress && (
            <div className="campaign-progress">
              <label htmlFor="campaign-progress">
                Campaign progress: {Math.round(progress)}%
              </label>
              <progress id="campaign-progress" max={100} value={progress} />
            </div>
          )}
          {verifiedProgress &&
            campaign.goal != null &&
            campaign.raised != null && (
              <p>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(campaign.raised)}{" "}
                raised of{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(campaign.goal)}
              </p>
            )}
          <Action
            link={{
              label:
                campaign.status === "development"
                  ? "Explore campaigns"
                  : "Support this campaign",
              href: campaign.route,
            }}
          />
        </div>
      </div>
    </section>
  );
}
