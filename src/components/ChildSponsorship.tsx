/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
import type { ChildSponsorshipContent } from "@/content/child-sponsorship";
import type { HomeContent } from "@/content/home";
import { Action, Photo, SectionHeading, TextLink } from "./ui";
import Newsletter from "./Newsletter";

export default function ChildSponsorship({ content, home }: { content: ChildSponsorshipContent; home: HomeContent }) {
  return <>
    <section className="sponsorship-hero section" aria-labelledby="sponsorship-heading">
      <div className="container sponsorship-hero-grid">
        <div className="sponsorship-hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 id="sponsorship-heading">{content.hero.heading}</h1>
          <p className="lede">{content.hero.description}</p>
          <div className="sponsorship-hero-actions">
            <Action link={content.sponsorLink} />
            <TextLink link={{ label: content.hero.secondary, href: "#sponsorship-support" }} />
          </div>
        </div>
        <Photo media={content.heroImage} className="sponsorship-hero-photo" sizes="(min-width: 768px) 48vw, 100vw" preload />
      </div>
    </section>

    <section className="sponsorship-anchor" aria-labelledby="sponsorship-anchor-heading">
      <div className="container sponsorship-anchor-grid">
        <div className="sponsorship-amount" aria-label={`${content.anchor.amount} ${content.anchor.period}`}>
          <strong>{content.anchor.amount}</strong><span>{content.anchor.period}</span>
        </div>
        <div className="sponsorship-anchor-copy">
          <h2 id="sponsorship-anchor-heading">{content.anchor.heading}</h2>
          <p>{content.anchor.description}</p>
          <div className="sponsorship-anchor-action"><Action link={content.anchorLink} /><small>{content.anchor.note}</small></div>
        </div>
      </div>
    </section>

    <section className="section sponsorship-support" id="sponsorship-support" aria-labelledby="sponsorship-support-heading">
      <div className="container">
        <div className="sponsorship-support-intro">
          <SectionHeading eyebrow={content.support.eyebrow} title={content.support.heading} description={content.support.description} id="sponsorship-support-heading" />
          <Photo media={content.supportImage} sizes="(min-width: 768px) 42vw, 100vw" />
        </div>
        <div className="sponsorship-groups">
          {content.support.groups.map((group, index) => <article className={`sponsorship-group sponsorship-group--${index + 1}`} key={group.label}>
            <p className="support-index" aria-hidden="true">{String.fromCharCode(65 + index)}</p>
            <h3>{group.label}</h3>
            <p>{group.introduction}</p>
            <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section section--paper sponsorship-process" aria-labelledby="sponsorship-process-heading">
      <div className="container">
        <SectionHeading eyebrow={content.process.eyebrow} title={content.process.heading} id="sponsorship-process-heading" />
        <ol className="sponsorship-steps">
          {content.process.steps.map((step) => <li key={step.number}>
            <span aria-hidden="true">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p>
          </li>)}
        </ol>
        <Action link={content.processLink} />
      </div>
    </section>

    <section className="sponsorship-connection" aria-labelledby="sponsorship-connection-heading">
      <div className="container sponsorship-connection-grid">
        <div><p className="eyebrow">{content.connection.eyebrow}</p><h2 id="sponsorship-connection-heading">{content.connection.heading}</h2><p>{content.connection.description}</p></div>
        <ul>{content.connection.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>

    <section className="section sponsorship-voices" aria-labelledby="sponsorship-voices-heading">
      <div className="container">
        <SectionHeading eyebrow={content.voices.eyebrow} title={content.voices.heading} description={content.voices.description} id="sponsorship-voices-heading" />
        <div className="sponsorship-voices-layout">
          {content.voices.testimonials.map((testimonial, index) => <article className={index === 0 ? "sponsorship-voice sponsorship-voice--featured" : "sponsorship-voice"} key={testimonial.name}>
            <Photo media={testimonial.image} sizes={index === 0 ? "(min-width: 768px) 44vw, 100vw" : "(min-width: 768px) 18vw, 42vw"} />
            <div className="sponsorship-voice-copy"><blockquote><p>{testimonial.statement}</p></blockquote><cite>{testimonial.name}</cite></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section section--paper sponsorship-faq" aria-labelledby="sponsorship-faq-heading">
      <div className="container sponsorship-faq-grid">
        <div><p className="eyebrow">{content.faq.eyebrow}</p><h2 id="sponsorship-faq-heading">{content.faq.heading}</h2><TextLink link={content.faqContactLink} /></div>
        <div className="faq-list">
          {content.faq.items.map((item) => <details key={item.question}><summary><span>{item.question}</span><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
        </div>
      </div>
    </section>

    <Newsletter home={home} />

    <section className="final-cta sponsorship-final" aria-labelledby="sponsorship-final-heading">
      <div className="container"><p className="pill">{content.final.eyebrow}</p><h2 id="sponsorship-final-heading">{content.final.heading}</h2><p>{content.final.description}</p><div className="final-actions"><Action link={content.finalSponsorLink} /><Action link={content.contactLink} variant="secondary" /></div></div>
    </section>
  </>;
}

export function SponsorshipStructuredData({ content, home }: { content: ChildSponsorshipContent; home: HomeContent }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: content.locale,
    name: content.faq.heading,
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
    publisher: { "@type": "Organization", name: "Dove Youth Development", url: `https://www.doveyouthdevelopment.org/${home.locale}` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
