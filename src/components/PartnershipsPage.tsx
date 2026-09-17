/* Hallmark · genre: warm institutional editorial · macrostructure: Relationship Ledger
 * theme: locked Dove design system · enrichment: source-verified community photography
 * variation: split hero / asymmetric partnership ledger / workforce bridge / historical evidence / inquiry
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import type { HomeContent } from "@/content/home";
import type { PartnershipsContent } from "@/content/partnerships";
import { Action, Photo, SectionHeading, TextLink } from "./ui";
import Newsletter from "./Newsletter";
import PartnershipInquiryForm from "./PartnershipInquiryForm";

export default function PartnershipsPage({ content, home }: { content: PartnershipsContent; home: HomeContent }) {
  const [leadWay, ...otherWays] = content.ways.items;
  return <>
    <section className="partner-hero section" aria-labelledby="partner-heading">
      <div className="container partner-hero-grid">
        <div className="partner-hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 id="partner-heading">{content.hero.heading}</h1>
          <p className="lede">{content.hero.description}</p>
          <div className="partner-hero-actions"><Action link={content.heroLinks.primary} /><TextLink link={content.heroLinks.secondary} /></div>
        </div>
        <div className="partner-hero-media">
          <Photo media={content.media.hero} sizes="(min-width: 768px) 52vw, 100vw" preload />
          <p>{content.hero.caption}</p>
        </div>
      </div>
    </section>

    <section className="partner-foundation section section--paper" aria-labelledby="partner-foundation-heading">
      <div className="container partner-foundation-grid">
        <div><p className="eyebrow">{content.foundation.eyebrow}</p><h2 id="partner-foundation-heading">{content.foundation.heading}</h2></div>
        <div>{content.foundation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<strong>{content.foundation.statement}</strong></div>
      </div>
    </section>

    <section id="ways-to-partner" className="partner-ways section" aria-labelledby="partner-ways-heading">
      <div className="container">
        <div className="partner-ways-head"><SectionHeading eyebrow={content.ways.eyebrow} title={content.ways.heading} description={content.ways.description} id="partner-ways-heading" /></div>
        <div className="partner-ways-layout">
          <article className="partner-way-lead">
            <span aria-hidden="true">01</span><p className="eyebrow">{leadWay.label}</p><h3>{leadWay.title}</h3><p>{leadWay.description}</p><TextLink link={{ label: leadWay.cta, href: leadWay.href }} />
          </article>
          <ol className="partner-way-ledger" start={2}>
            {otherWays.map((item, index) => <li key={item.id}>
              <span aria-hidden="true">{String(index + 2).padStart(2, "0")}</span>
              <div><p className="partner-way-label">{item.label}</p><h3>{item.title}</h3><p>{item.description}</p><TextLink link={{ label: item.cta, href: item.href }} /></div>
            </li>)}
          </ol>
        </div>
      </div>
    </section>

    <section className="partner-workforce" aria-labelledby="partner-workforce-heading">
      <div className="container partner-workforce-grid">
        <div className="partner-workforce-copy">
          <p className="eyebrow">{content.workforce.eyebrow}</p><h2 id="partner-workforce-heading">{content.workforce.heading}</h2><p>{content.workforce.description}</p>
          <ul>{content.workforce.points.map((point) => <li key={point}>{point}</li>)}</ul>
          <p className="partner-workforce-note">{content.workforce.note}</p>
          <Action link={content.workforceLink} variant="secondary" />
        </div>
        <Photo media={content.media.workforce} sizes="(min-width: 768px) 48vw, 100vw" />
      </div>
    </section>

    {content.approvedFeaturedPartners.length > 0 && <section className="section" aria-labelledby="partner-action-heading">
      <div className="container"><p className="eyebrow">{content.caseStudy.eyebrow}</p><h2 id="partner-action-heading">{content.caseStudy.heading}</h2></div>
    </section>}

    <section className="partner-history section section--paper" aria-labelledby="partner-history-heading">
      <div className="container partner-history-grid">
        <SectionHeading eyebrow={content.history.eyebrow} title={content.history.heading} description={content.history.description} id="partner-history-heading" />
        <ol>{content.history.items.map((item) => <li key={item.title}><p>{item.date}</p><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>
      </div>
    </section>

    <section className="partner-community section" aria-labelledby="partner-community-heading">
      <div className="container">
        <div className="partner-community-copy"><p className="eyebrow">{content.community.eyebrow}</p><h2 id="partner-community-heading">{content.community.heading}</h2><p className="lede">{content.community.description}</p></div>
        <aside className="partner-team-bridge" aria-labelledby="partner-team-heading">
          <p className="eyebrow">{content.community.bridgeEyebrow}</p><div><h3 id="partner-team-heading">{content.community.bridgeHeading}</h3><p>{content.community.bridgeDescription}</p></div><Action link={content.communityLink} variant="teal" />
        </aside>
      </div>
    </section>

    <section className="partner-journey section section--paper" aria-labelledby="partner-journey-heading">
      <div className="container">
        <div className="partner-journey-head"><SectionHeading eyebrow={content.journey.eyebrow} title={content.journey.heading} description={content.journey.description} id="partner-journey-heading" /></div>
        <ol>{content.journey.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
      </div>
    </section>

    <section id="partner-inquiry" className="partner-inquiry section" aria-labelledby="partner-inquiry-heading">
      <div className="container partner-inquiry-grid">
        <div id="partner-inquiry-intro"><SectionHeading eyebrow={content.inquiry.eyebrow} title={content.inquiry.heading} description={content.inquiry.description} id="partner-inquiry-heading" /></div>
        <PartnershipInquiryForm content={content} />
      </div>
    </section>

    <section className="partner-matching" aria-labelledby="partner-matching-heading">
      <div className="container partner-matching-grid"><p className="eyebrow">{content.matching.eyebrow}</p><div><h2 id="partner-matching-heading">{content.matching.heading}</h2><p>{content.matching.description}</p></div><Action link={content.matchingLink} variant="secondary" /></div>
    </section>

    <section className="partner-faq section section--paper" aria-labelledby="partner-faq-heading">
      <div className="container partner-faq-grid">
        <div><p className="eyebrow">{content.faq.eyebrow}</p><h2 id="partner-faq-heading">{content.faq.heading}</h2></div>
        <div className="faq-list">{content.faq.items.map((item) => <details key={item.question}><summary><span>{item.question}</span><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </div>
    </section>

    <Newsletter home={home} />
  </>;
}

export function PartnershipsStructuredData({ content, home }: { content: PartnershipsContent; home: HomeContent }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: content.locale,
    name: content.faq.heading,
    mainEntity: content.faq.items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
    publisher: { "@type": "Organization", name: "Dove Youth Development", url: `https://www.doveyouthdevelopment.org/${home.locale}` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
