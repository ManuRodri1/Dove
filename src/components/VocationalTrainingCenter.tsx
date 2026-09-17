/* Hallmark · genre: editorial · macrostructure: Narrative Workflow · theme: locked Dove system
 * enrichment: H6 photographic fold using source-verified Dove photography · nav/footer: shared project components
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import type { HomeContent } from "@/content/home";
import type { VocationalTrainingContent } from "@/content/vocational-training";
import { Action, Photo, TextLink } from "./ui";
import Newsletter from "./Newsletter";

export default function VocationalTrainingCenter({ content, home }: { content: VocationalTrainingContent; home: HomeContent }) {
  const [readiness, ...pathways] = content.pathways.programs;
  return <>
    <section className="vocational-hero section" aria-labelledby="vocational-heading">
      <div className="container">
        <div className="vocational-hero-intro">
          <div>
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="vocational-heading">{content.hero.heading}</h1>
          </div>
          <div className="vocational-hero-copy">
            <p className="lede">{content.hero.description}</p>
            <div className="vocational-actions">
              <Action link={content.donationLink} />
              <TextLink link={{ label: content.hero.secondary, href: "#training-pathways" }} />
            </div>
          </div>
        </div>
        <Photo media={content.heroImage} className="vocational-hero-photo" sizes="(min-width: 1280px) 1176px, 100vw" preload />
        <div className="vocational-hero-caption"><span>{content.hero.caption}</span><strong>{content.hero.location}</strong></div>
      </div>
    </section>

    <section className="section vocational-why" aria-labelledby="vocational-why-heading">
      <div className="container vocational-why-grid">
        <div><h2 id="vocational-why-heading">{content.why.heading}</h2><p className="lede">{content.why.introduction}</p></div>
        <div>
          <ul className="vocational-questions">{content.why.questions.map((question) => <li key={question}>{question}</li>)}</ul>
          <p className="vocational-answer">{content.why.answer}</p>
        </div>
      </div>
    </section>

    <section className="section section--paper vocational-pathways" id="training-pathways" aria-labelledby="training-pathways-heading">
      <div className="container">
        <div className="vocational-section-head"><h2 id="training-pathways-heading">{content.pathways.heading}</h2><p className="lede">{content.pathways.description}</p></div>
        <article className="readiness-foundation">
          <div className="program-number" aria-hidden="true">{readiness.number}</div>
          <div className="readiness-copy"><p className="program-label">{readiness.label}</p><h3>{readiness.title}</h3><p>{readiness.description}</p></div>
          {readiness.details && <ul>{readiness.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
        </article>
        <div className="vocational-program-grid">
          <div><Photo media={content.pathwayImage} className="vocational-program-photo" sizes="(min-width: 768px) 42vw, 100vw" /><p className="archive-caption">{content.pathways.archive}</p></div>
          <ol className="vocational-program-list" start={2}>
            {pathways.map((program) => <li key={program.number}>
              <span className="program-number" aria-hidden="true">{program.number}</span>
              <div><p className="program-label">{program.label}</p><h3>{program.title}</h3><p>{program.description}</p></div>
            </li>)}
          </ol>
        </div>
      </div>
    </section>

    <section className="vocational-readiness" aria-labelledby="vocational-readiness-heading">
      <div className="container vocational-readiness-grid">
        <div><h2 id="vocational-readiness-heading">{content.readiness.heading}</h2><p>{content.readiness.description}</p></div>
        <ol>{content.readiness.points.map((point, index) => <li key={point}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{point}</li>)}</ol>
      </div>
    </section>

    <section className="section vocational-outcomes" aria-labelledby="vocational-outcomes-heading">
      <div className="container">
        <div className="vocational-section-head vocational-section-head--wide"><h2 id="vocational-outcomes-heading">{content.outcomes.heading}</h2><p className="lede">{content.outcomes.description}</p></div>
        <ol className="vocational-outcome-flow">{content.outcomes.paths.map((path, index) => <li key={path.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{path.title}</h3><p>{path.description}</p></li>)}</ol>
        <div className="vocational-evidence">
          <div><h3>{content.outcomes.evidenceHeading}</h3><p>{content.outcomes.evidenceDescription}</p></div>
          <ul>{content.outcomes.examples.map((example) => <li key={example}>{example}</li>)}</ul>
        </div>
      </div>
    </section>

    <section className="section section--paper vocational-jodelka" aria-labelledby="vocational-jodelka-heading">
      <div className="container vocational-jodelka-grid">
        <blockquote><p>“{content.jodelka.quote}”</p><cite>{content.jodelka.attribution}</cite></blockquote>
        <div><h2 id="vocational-jodelka-heading">{content.jodelka.heading}</h2><p className="lede">{content.jodelka.description}</p><small>{content.jodelka.note}</small></div>
      </div>
    </section>

    <section className="section vocational-origin" aria-labelledby="vocational-origin-heading">
      <div className="container vocational-origin-grid">
        <div><p className="eyebrow">{content.origin.eyebrow}</p><h2 id="vocational-origin-heading">{content.origin.heading}</h2><p className="lede">{content.origin.description}</p><TextLink link={content.storyLink} /></div>
        <div><Photo media={content.originImage} className="vocational-origin-photo" sizes="(min-width: 768px) 48vw, 100vw" /><p className="archive-caption">{content.origin.archive}</p></div>
      </div>
    </section>

    <section className="vocational-support" aria-labelledby="vocational-support-heading">
      <div className="container vocational-support-grid">
        <div><h2 id="vocational-support-heading">{content.support.heading}</h2><p>{content.support.description}</p><ul>{content.support.categories.map((category) => <li key={category}>{category}</li>)}</ul><Action link={content.supportLink} /></div>
        <aside aria-labelledby="vocational-partner-heading"><h3 id="vocational-partner-heading">{content.support.partnerHeading}</h3><p>{content.support.partnerDescription}</p><TextLink link={content.partnerLink} /></aside>
      </div>
    </section>

    <section className="section vocational-founder" aria-labelledby="vocational-founder-heading">
      <div className="container vocational-founder-grid">
        <Photo media={content.founderImage} className="vocational-founder-photo" sizes="(min-width: 768px) 28vw, 100vw" />
        <div><h2 id="vocational-founder-heading">{content.founder.heading}</h2><p className="lede">{content.founder.description}</p></div>
      </div>
    </section>

    <section className="section section--paper vocational-faq" aria-labelledby="vocational-faq-heading">
      <div className="container vocational-faq-grid">
        <h2 id="vocational-faq-heading">{content.faq.heading}</h2>
        <div className="faq-list">{content.faq.items.map((item) => <details key={item.question}><summary><span>{item.question}</span><span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </div>
    </section>

    <Newsletter home={home} />

    <section className="final-cta vocational-final" aria-labelledby="vocational-final-heading">
      <div className="container"><p className="pill">{content.final.eyebrow}</p><h2 id="vocational-final-heading">{content.final.heading}</h2><p>{content.final.description}</p><div className="final-actions"><Action link={content.finalDonationLink} /><Action link={content.finalPartnerLink} variant="secondary" /></div></div>
    </section>
  </>;
}

export function VocationalStructuredData({ content, home }: { content: VocationalTrainingContent; home: HomeContent }) {
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
