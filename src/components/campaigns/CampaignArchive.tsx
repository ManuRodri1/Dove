import Image from "next/image";
import Link from "next/link";
import { links } from "@/content/links";
import { getCampaignsCopy } from "@/content/campaigns-ui";
import CampaignsHeroVideo from "./CampaignsHeroVideo";
import type { Locale } from "@/i18n/config";
import type { PublicCampaign } from "@/lib/cms/public-campaigns";

function CampaignFeature({ campaign, locale }: { campaign: PublicCampaign; locale: Locale }) {
  const copy = getCampaignsCopy(locale);
  return <article className="campaign-feature">
    {campaign.heroImage && <div className="campaign-feature-media"><Image src={campaign.heroImage.url} alt="" fill sizes="(min-width: 900px) 58vw, 100vw" style={{ objectFit: "cover", objectPosition: `${(campaign.heroImage.focalX ?? .5) * 100}% ${(campaign.heroImage.focalY ?? .5) * 100}%` }} /></div>}
    <div className="campaign-feature-copy"><p className="campaign-state">{copy.states[campaign.lifecycle]}</p><h3>{campaign.title}</h3><p>{campaign.excerpt}</p>
      <CampaignFacts campaign={campaign} locale={locale} /><Link className="button button--primary" href={campaign.href}>{copy.view}</Link></div>
  </article>;
}

function CampaignFacts({ campaign, locale }: { campaign: PublicCampaign; locale: Locale }) {
  const date = campaign.endDate ?? campaign.startDate;
  const year = date ? new Intl.DateTimeFormat(locale, { year: "numeric" }).format(new Date(`${date}T12:00:00Z`)) : campaign.title.match(/\b(20\d{2})\b/)?.[1];
  return <dl className="campaign-facts">{year && <div><dt>{locale === "es" ? "Año" : "Year"}</dt><dd>{year}</dd></div>}{campaign.location && <div><dt>{locale === "es" ? "Lugar" : "Location"}</dt><dd>{campaign.location}</dd></div>}</dl>;
}

function CampaignHistory({ campaign, locale }: { campaign: PublicCampaign; locale: Locale }) {
  const copy = getCampaignsCopy(locale);
  return <article className="campaign-history-item">
    <div className="campaign-history-year"><CampaignFacts campaign={campaign} locale={locale} /></div>
    {campaign.heroImage && <div className="campaign-history-media"><Image src={campaign.heroImage.url} alt="" fill sizes="(min-width: 900px) 30vw, 100vw" style={{ objectFit: "cover" }} /></div>}
    <div><h3>{campaign.title}</h3><p>{campaign.excerpt}</p><Link className="text-link" href={campaign.href}>{copy.view}<span aria-hidden="true">→</span></Link></div>
  </article>;
}

export default function CampaignArchive({ locale, active, upcoming, past, showAllPast }: { locale: Locale; active: PublicCampaign[]; upcoming: PublicCampaign[]; past: PublicCampaign[]; showAllPast: boolean }) {
  const copy = getCampaignsCopy(locale);
  return <>
    <CampaignsHeroVideo locale={locale} copy={copy} />
    <div className="campaigns-index container">
      {active.length ? <section aria-labelledby="current-campaigns"><header className="campaign-section-head"><h2 id="current-campaigns">{copy.current}</h2><span>{String(active.length).padStart(2, "0")}</span></header>{active.map((campaign) => <CampaignFeature key={campaign.id} campaign={campaign} locale={locale} />)}</section> : <section className="campaign-empty" aria-labelledby="current-campaigns"><h2 id="current-campaigns">{copy.current}</h2><p>{copy.empty}</p><div className="campaign-empty-actions"><a className="button button--primary" href={links.giving.general}>{copy.donate}</a><a className="button button--teal" href={links.giving.childSponsorship}>{copy.sponsor}</a></div></section>}
      {upcoming.length > 0 && <section aria-labelledby="upcoming-campaigns"><header className="campaign-section-head"><h2 id="upcoming-campaigns">{copy.upcoming}</h2><span>{String(upcoming.length).padStart(2, "0")}</span></header>{upcoming.map((campaign) => <CampaignFeature key={campaign.id} campaign={campaign} locale={locale} />)}</section>}
      {past.length > 0 && <section aria-labelledby="past-campaigns"><header className="campaign-section-head"><h2 id="past-campaigns">{copy.past}</h2><span>{String(past.length).padStart(2, "0")}</span></header><div className="campaign-history">{past.map((campaign) => <CampaignHistory key={campaign.id} campaign={campaign} locale={locale} />)}</div>{!showAllPast && past.length >= 6 && <Link className="campaign-view-all text-link" href={`/${locale}/campaigns?view=all`}>{copy.viewAll}<span aria-hidden="true">→</span></Link>}</section>}
    </div>
  </>;
}
