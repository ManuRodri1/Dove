/* Hallmark · genre: editorial · macrostructure: Feature Stack · theme: locked Dove system
 * enrichment: E2 full-bleed muted YouTube loop · poster-first · privacy-enhanced embed
 * variation: sticky general-giving anchor / typographic pathway stack / restrained trust sequence
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import type { HomeContent } from "@/content/home";
import type { DonateContent } from "@/content/donate";
import { Action, TextLink } from "./ui";
import DonateHeroVideo from "./DonateHeroVideo";
import Newsletter from "./Newsletter";

export default function DonatePage({ content, home }: { content: DonateContent; home: HomeContent }) {
  const featured = content.options.find((option) => option.featured)!;
  const pathways = content.options.filter((option) => !option.featured);
  return <>
    <DonateHeroVideo content={content} />

    <section className="section donate-pathways" id="giving-pathways" aria-labelledby="giving-pathways-heading">
      <div className="container">
        <div className="donate-pathways-intro">
          <div><p className="eyebrow">{content.pathways.eyebrow}</p><h2 id="giving-pathways-heading">{content.pathways.heading}</h2></div>
          <p className="lede">{content.pathways.description}</p>
        </div>
        <div className="donate-stack">
          <article className="donate-primary-path" data-donation-id={featured.id}>
            <p className="donate-path-label">{featured.label}</p>
            <h3>{featured.title}</h3>
            <p>{featured.description}</p>
            <Action link={{ label: featured.cta, href: featured.href }} />
            <small>Network for Good / Bonterra <span aria-hidden="true">↗</span></small>
          </article>
          <div className="donate-path-list">
            {pathways.map((option, index) => <article className="donate-path" data-donation-id={option.id} key={`${option.id}-${index}`}>
              <div className="donate-path-number" aria-hidden="true">{String(index + 2).padStart(2, "0")}</div>
              <div>
                <p className="donate-path-label">{option.label}</p>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <TextLink link={{ label: option.cta, href: option.href }} />
              </div>
            </article>)}
          </div>
        </div>
      </div>
    </section>

    <section className="section section--paper donate-impact" aria-labelledby="donate-impact-heading">
      <div className="container donate-impact-grid">
        <div><h2 id="donate-impact-heading">{content.impact.heading}</h2><p className="lede">{content.impact.description}</p></div>
        <ol>{content.impact.areas.map((area, index) => <li key={area.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{area.title}</h3><p>{area.description}</p></div></li>)}</ol>
      </div>
    </section>

    <section className="section donate-other" aria-labelledby="donate-other-heading">
      <div className="container">
        <h2 id="donate-other-heading">{content.otherWays.heading}</h2>
        <div className="donate-other-grid">
          <article className="donate-recurring"><p className="eyebrow">{content.otherWays.recurring.label}</p><h3>{content.otherWays.recurring.heading}</h3><p>{content.otherWays.recurring.description}</p><Action link={content.recurringLink} variant="teal" /></article>
          <article className="donate-tribute"><p className="eyebrow">{content.otherWays.tribute.label}</p><h3>{content.otherWays.tribute.heading}</h3><p>{content.otherWays.tribute.description}</p><TextLink link={content.tributeLink} /></article>
        </div>
      </div>
    </section>

    <section className="donate-partnership" aria-labelledby="donate-partnership-heading">
      <div className="container donate-partnership-grid">
        <p className="eyebrow">{content.partnership.eyebrow}</p>
        <div><h2 id="donate-partnership-heading">{content.partnership.heading}</h2><p>{content.partnership.description}</p></div>
        <Action link={content.partnershipLink} variant="secondary" />
      </div>
    </section>

    <section className="section section--paper donate-trust" aria-labelledby="donate-trust-heading">
      <div className="container">
        <div className="donate-trust-intro"><h2 id="donate-trust-heading">{content.trust.heading}</h2><p className="lede">{content.trust.description}</p></div>
        <ol>{content.trust.steps.map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
        <p className="donate-trust-statement">{content.trust.statement}</p>
      </div>
    </section>

    <section className="section donate-faq" aria-labelledby="donate-faq-heading">
      <div className="container donate-faq-grid">
        <h2 id="donate-faq-heading">{content.faq.heading}</h2>
        <div className="faq-list">{content.faq.items.map((item) => <details key={item.question}><summary><span>{item.question}</span><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </div>
    </section>

    <Newsletter home={home} />

    <section className="final-cta donate-final" aria-labelledby="donate-final-heading">
      <div className="container"><p className="pill">{content.final.eyebrow}</p><h2 id="donate-final-heading">{content.final.heading}</h2><p>{content.final.description}</p><div className="final-actions"><Action link={content.finalGeneralLink} /><Action link={content.finalSponsorLink} variant="secondary" /></div></div>
    </section>
  </>;
}

import { getFaqSchema } from "@/lib/schema";

export function DonateStructuredData({ content }: { content: DonateContent; home?: HomeContent }) {
  const data = getFaqSchema(content.faq.heading, content.faq.items, content.locale);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
