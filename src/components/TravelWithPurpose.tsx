/* Hallmark · genre: editorial travel narrative · macrostructure: Mosaic Journey
 * theme: locked Dove design system · enrichment: source-verified documentary group photography
 * variation: split image hero / duration ledger / full-bleed connection / planning inquiry
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import type { HomeContent } from "@/content/home";
import type { TravelWithPurposeContent } from "@/content/travel-with-purpose";
import { Action, Photo, SectionHeading, TextLink } from "./ui";
import Newsletter from "./Newsletter";
import GroupExperienceInquiryForm from "./GroupExperienceInquiryForm";

import TripadvisorReviews from "./travel/TripadvisorReviews";

export default function TravelWithPurpose({ content, home }: { content: TravelWithPurposeContent; home: HomeContent }) {
  return <>
    <section className="travel-hero section" aria-labelledby="travel-heading">
      <div className="container travel-hero-grid">
        <div className="travel-hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 id="travel-heading">{content.hero.heading}</h1>
          <p className="lede">{content.hero.description}</p>
          <div className="travel-hero-actions"><Action link={content.heroLinks.primary} /><TextLink link={content.heroLinks.secondary} /></div>
        </div>
        <div className="travel-hero-media">
          <Photo media={content.media.hero} sizes="(min-width: 768px) 58vw, 100vw" preload />
          <p>{content.hero.caption}</p>
        </div>
      </div>
    </section>

    <section id="experience" className="travel-experience section section--paper" aria-labelledby="travel-experience-heading">
      <div className="container">
        <div className="travel-experience-intro">
          <SectionHeading eyebrow={content.experience.eyebrow} title={content.experience.heading}
            description={content.experience.description} id="travel-experience-heading" />
          <p className="travel-experience-note">{content.experience.note}</p>
        </div>
        <div className="travel-moments">
          {content.experience.moments.map((moment, index) => <article className={`travel-moment travel-moment--${index + 1}`} key={moment.title}>
            <Photo media={index === 0 ? content.media.facePainting : content.media.snackPreparation}
              sizes="(min-width: 768px) 45vw, 100vw" />
            <div><p className="eyebrow">{moment.label}</p><h3>{moment.title}</h3><p>{moment.description}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="travel-durations section" aria-labelledby="travel-durations-heading">
      <div className="container">
        <div className="travel-durations-head">
          <SectionHeading eyebrow={content.durations.eyebrow} title={content.durations.heading}
            description={content.durations.description} id="travel-durations-heading" />
          <p>{content.durations.statement}</p>
        </div>
        <ol className="travel-duration-ledger">
          {content.durations.items.map((item, index) => <li key={item.duration}>
            <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.duration}</strong><div><h3>{item.title}</h3><p>{item.description}</p></div>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="travel-connection" aria-labelledby="travel-connection-heading">
      <Photo media={content.media.groupCircle} sizes="100vw" className="travel-connection-photo" />
      <div className="travel-connection-overlay" aria-hidden="true" />
      <div className="container travel-connection-copy">
        <p className="eyebrow">{content.connection.eyebrow}</p>
        <h2 id="travel-connection-heading">{content.connection.heading}</h2>
        <p>{content.connection.description}</p>
      </div>
    </section>

    <section className="travel-share section section--paper" aria-labelledby="travel-share-heading">
      <div className="container travel-share-grid">
        <SectionHeading eyebrow={content.share.eyebrow} title={content.share.heading}
          description={content.share.description} id="travel-share-heading" />
        <div>
          <ul>{content.share.examples.map((example) => <li key={example}>{example}</li>)}</ul>
          <p className="travel-safeguard">{content.share.safeguard}</p>
        </div>
      </div>
    </section>

    <section className="travel-logistics section" aria-labelledby="travel-logistics-heading" data-client-confirmed="false">
      <div className="container">
        <div className="travel-logistics-head">
          <div><p className="eyebrow">{content.logistics.eyebrow}</p><h2 id="travel-logistics-heading">{content.logistics.heading}</h2></div>
          <p className="lede">{content.logistics.description}</p>
        </div>
        <div className="travel-logistics-list">
          {content.logistics.items.map((item, index) => <article key={item.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p>
          </article>)}
        </div>
        <p className="travel-logistics-note">{content.logistics.note}</p>
      </div>
    </section>

    <section className="travel-puerto-plata" aria-labelledby="travel-puerto-plata-heading">
      <div className="container travel-puerto-plata-grid">
        <div><p className="eyebrow">{content.puertoPlata.eyebrow}</p><h2 id="travel-puerto-plata-heading">{content.puertoPlata.heading}</h2><p>{content.puertoPlata.description}</p></div>
        <ul>{content.puertoPlata.themes.map((theme, index) => <li key={theme}><span>{String(index + 1).padStart(2, "0")}</span>{theme}</li>)}</ul>
      </div>
    </section>

    <section className="travel-principles section section--paper" aria-labelledby="travel-principles-heading">
      <div className="container">
        <SectionHeading eyebrow={content.principles.eyebrow} title={content.principles.heading} id="travel-principles-heading" />
        <ol>{content.principles.items.map((item, index) => <li key={item.title}>
          <span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p>
        </li>)}</ol>
      </div>
    </section>

    <section className="travel-planning section" aria-labelledby="travel-planning-heading">
      <div className="container">
        <div className="travel-planning-head"><p className="eyebrow">{content.planning.eyebrow}</p><h2 id="travel-planning-heading">{content.planning.heading}</h2></div>
        <ol>{content.planning.steps.map((step, index) => <li key={step.title}>
          <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div>
        </li>)}</ol>
        <div className="travel-planning-actions"><Action link={content.planningLinks.guidelines} variant="teal" /><TextLink link={content.planningLinks.participant} /></div>
      </div>
    </section>

    <section id="group-inquiry" className="travel-inquiry section section--paper" aria-labelledby="travel-inquiry-heading">
      <div className="container">
        <div className="travel-inquiry-intro" id="group-inquiry-intro">
          <SectionHeading eyebrow={content.inquiry.eyebrow} title={content.inquiry.heading}
            description={content.inquiry.description} id="travel-inquiry-heading" />
        </div>
        <GroupExperienceInquiryForm content={content} />
      </div>
    </section>

    <section className="travel-individual" aria-labelledby="travel-individual-heading">
      <div className="container travel-individual-grid">
        <p className="eyebrow">{content.individual.eyebrow}</p>
        <div><h2 id="travel-individual-heading">{content.individual.heading}</h2><p>{content.individual.description}</p></div>
        <Action link={content.individualLink} variant="secondary" />
      </div>
    </section>

    <TripadvisorReviews
      eyebrow={content.reviews.eyebrow}
      heading={content.reviews.heading}
      description={content.reviews.description}
      buttonLabel={content.locale === "es" ? "Cargar opiniones de TripAdvisor" : "Load TripAdvisor Reviews"}
      viewDirectLabel={content.locale === "es" ? "Ver en TripAdvisor" : "View on TripAdvisor"}
    />

    <section className="travel-faq section" aria-labelledby="travel-faq-heading">
      <div className="container travel-faq-grid">
        <div><p className="eyebrow">{content.faq.eyebrow}</p><h2 id="travel-faq-heading">{content.faq.heading}</h2></div>
        <div className="faq-list">{content.faq.items.map((item) => <details key={item.question}><summary><span>{item.question}</span><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </div>
    </section>

    <Newsletter home={home} />
  </>;
}

import { getFaqSchema } from "@/lib/schema";

export function TravelWithPurposeStructuredData({ content }: { content: TravelWithPurposeContent; home?: HomeContent }) {
  const data = getFaqSchema(content.faq.heading, content.faq.items, content.locale);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
