import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/content/BlockRenderer";
import { getCampaignsCopy } from "@/content/campaigns-ui";
import { externalRel } from "@/content/links";
import { canDisplayProgress, type PublicCampaignDetail } from "@/lib/cms/public-campaigns";
import type { Locale } from "@/i18n/config";

function money(value: number, currency: string, locale: Locale) { return new Intl.NumberFormat(locale === "es" ? "es-DO" : "en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value); }

export default function CampaignDetail({ campaign, locale }: { campaign: PublicCampaignDetail; locale: Locale }) {
  const copy = getCampaignsCopy(locale);
  const showProgress = canDisplayProgress(campaign);
  return <article className="campaign-detail">
    <header className={`campaign-detail-hero ${campaign.heroImage ? "has-media" : ""}`}>
      {campaign.heroImage && <Image src={campaign.heroImage.url} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: `${(campaign.heroImage.focalX ?? .5) * 100}% ${(campaign.heroImage.focalY ?? .5) * 100}%` }} />}
      <div className="campaign-detail-overlay" /><div className="container campaign-detail-heading"><Link className="campaign-back" href={`/${locale}/campaigns`}>← {copy.back}</Link><p className="eyebrow">{campaign.eyebrow || copy.states[campaign.lifecycle]}</p><h1>{campaign.headline || campaign.title}</h1><p className="lede">{campaign.excerpt}</p></div>
    </header>
    <section className="campaign-detail-summary"><div className="container"><div className="campaign-detail-status"><span>{copy.states[campaign.lifecycle]}</span>{campaign.location && <strong>{campaign.location}</strong>}</div>
      {(campaign.goalAmount !== null || showProgress) && <dl className="campaign-money">{campaign.goalAmount !== null && <div><dt>{copy.goal}</dt><dd>{money(campaign.goalAmount, campaign.currency, locale)}</dd></div>}{showProgress && <div><dt>{copy.raised}{campaign.lifecycle === "ended" && !campaign.raisedAmountIsFinal ? ` (${locale === "es" ? "cifra no final" : "not final"})` : ""}</dt><dd>{money(campaign.raisedAmount as number, campaign.currency, locale)}</dd>{campaign.progressUpdatedAt && <small>{copy.updated} {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(campaign.progressUpdatedAt))}</small>}</div>}</dl>}
      {campaign.donationUrl ? (
        <a className="button button--primary" href={campaign.donationUrl} rel={externalRel(campaign.donationUrl)}>
          {copy.donate}
        </a>
      ) : campaign.lifecycle === "ended" ? (
        <div className="campaign-detail-actions" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
          <Link className="button button--primary" href={`/${locale}/donate`}>
            {copy.supportDove}
          </Link>
          <Link className="button button--secondary" href={`/${locale}/campaigns`}>
            {copy.exploreCampaigns}
          </Link>
        </div>
      ) : null}</div></section>
    <BlockRenderer blocks={campaign.blocks} />
    {campaign.relatedStories.length > 0 && <section className="campaign-updates section"><div className="container"><header className="campaign-section-head"><h2>{copy.updates}</h2><span>{String(campaign.relatedStories.length).padStart(2, "0")}</span></header><ol>{campaign.relatedStories.map((story) => <li key={story.id}><p>{story.relationshipType}</p><h3><Link href={story.href}>{story.title}</Link></h3><p>{story.excerpt}</p></li>)}</ol></div></section>}
  </article>;
}
