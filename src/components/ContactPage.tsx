import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { links } from "@/content/links";
import { doveMedia } from "@/content/dove-media";
import { contactEn } from "@/i18n/messages/contact-copy";
import { contactEs } from "@/i18n/messages/contact-es-copy";
import { ContactForm } from "@/components/ContactForm";
import { ContactMap } from "@/components/ContactMap";

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = locale === "es" ? contactEs : contactEn;
  const email = links.email.executiveDirector.replace("mailto:", "");
  const externalArrow = "\u2197";
  const forwardArrow = "\u2192";
  const routes = [
    [copy.routing.general, email, copy.routing.email, "#contact-form"],
    [copy.routing.volunteer, links.email.volunteer.replace("mailto:", ""), copy.routing.volunteerCta, links.volunteer.page(locale)],
    [copy.routing.sponsorship, links.email.childSponsorship.replace("mailto:", ""), copy.routing.sponsorCta, links.childSponsorship(locale)],
    [copy.routing.travel, email, copy.routing.travelCta, links.travel.page(locale)],
  ];
  const socials = [["Instagram", links.social.instagram, copy.social.instagram], ["Twitter", links.social.twitter, copy.social.twitter], ["Facebook", links.social.facebook, copy.social.facebook], ["LinkedIn", links.social.linkedin, copy.social.linkedin], ["Tripadvisor", links.social.tripadvisor, copy.social.tripadvisor], ["TikTok", links.social.tiktok, copy.social.tiktok]];
  return <div className="contact-page">
    <section className="contact-hero page-shell"><div><p className="eyebrow">{copy.hero.eyebrow}</p><h1>{copy.hero.heading}</h1><p className="lede">{copy.hero.description}</p><div className="hero-actions"><a className="button button--primary" href="#contact-options">{copy.hero.primary}</a><a className="text-link" href="#find-us">{copy.hero.secondary} <span aria-hidden>{externalArrow}</span></a></div></div><div className="contact-hero-media"><Image src={doveMedia.contact.hero.src} alt={doveMedia.contact.hero.alt} width={1200} height={900} priority /></div></section>
    <section id="contact-options" className="section section--paper"><div className="page-shell"><p className="eyebrow">{copy.routing.eyebrow}</p><h2>{copy.routing.heading}</h2><p className="section-intro">{copy.routing.description}</p><div className="contact-ledger">{routes.map(([title,address,cta,href],i)=><article className="contact-ledger-row" key={title}><span className="ledger-index">0{i+1}</span><div><h3>{title}</h3><a className="contact-route-email" href={`mailto:${address}`}>{address}</a></div><a className="text-link" href={href}>{cta} <span aria-hidden>{externalArrow}</span></a></article>)}</div><div className="contact-phone-band"><strong>{copy.routing.phone}</strong><a href={links.phone.dominicanRepublic}>{copy.routing.dominican}: +1 809 676 4071</a><a href={links.phone.unitedStates}>{copy.routing.unitedStates}: +1 612 442 5974</a></div></div></section>
    <section id="find-us" className="section contact-map"><div className="page-shell"><p className="eyebrow">{copy.map.eyebrow}</p><h2>{copy.map.heading}</h2><p className="section-intro">{copy.map.description}</p><div className="map-layout"><ContactMap title={copy.map.title} embedUrl={links.location.embed} directionsLabel={copy.map.directions} viewInteractiveLabel={locale === "es" ? "Ver mapa interactivo" : "View Interactive Map"} /><aside><p className="map-location">{copy.map.location}</p><p>{copy.map.note}</p><a className="button button--primary" href={links.location.directions} target="_blank" rel="noopener noreferrer">{copy.map.directions} {externalArrow}</a><a className="text-link" href={links.travel.page(locale)}>{copy.map.visit} <span aria-hidden>{forwardArrow}</span></a></aside></div></div></section>
    <section id="contact-form" className="section section--paper contact-form-section"><div className="page-shell"><div><p className="eyebrow">{copy.form.eyebrow}</p><h2>{copy.form.heading}</h2><p className="section-intro">{copy.form.description}</p></div><ContactForm locale={locale} /></div></section>
    <section className="section contact-social"><div className="page-shell"><p className="eyebrow">{copy.social.eyebrow}</p><h2>{copy.social.heading}</h2><p className="section-intro">{copy.social.description}</p><div className="social-grid">{socials.map(([name,href,cta])=><a key={name} href={href} target="_blank" rel="noopener noreferrer"><span>{name}</span><small>{cta} {externalArrow}</small></a>)}</div></div></section>
    <section className="section contact-bridge"><div className="page-shell"><p className="eyebrow">{copy.bridge.eyebrow}</p><h2>{copy.bridge.heading}</h2><nav className="bridge-links" aria-label={copy.bridge.heading}><a href={links.travel.page(locale)}>{copy.bridge.travel} {externalArrow}</a><a href={links.volunteer.page(locale)}>{copy.bridge.volunteer} {externalArrow}</a><a href={links.childSponsorship(locale)}>{copy.bridge.sponsor} {externalArrow}</a><a href={links.donate(locale)}>{copy.bridge.donate} {externalArrow}</a></nav></div></section>
  </div>;
}
