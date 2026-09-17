/* Hallmark · genre: warm editorial nonprofit · macrostructure: Program Journey · theme: locked Dove system
 * enrichment: source-verified documentary photography · structural variety: image lead / editorial split / type bridge / teal feature / community close
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import type { HomeContent } from "@/content/home";
import type { WhatWeDoContent } from "@/content/what-we-do";
import { Action, Photo, TextLink } from "./ui";
import Newsletter from "./Newsletter";

function ProgramThemes({ themes }: { themes: readonly string[] }) {
  return <ul className="what-program-themes">{themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>;
}

export default function WhatWeDo({ content, home }: { content: WhatWeDoContent; home: HomeContent }) {
  const [youth, education, readiness, vocational, community] = content.programs.items;
  return <>
    <section className="what-hero section" aria-labelledby="what-heading">
      <div className="container what-hero-grid">
        <div className="what-hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 id="what-heading">{content.hero.heading}</h1>
          <p className="lede">{content.hero.description}</p>
          <div className="what-hero-actions">
            <Action link={content.heroLinks.primary} />
            <TextLink link={content.heroLinks.secondary} />
          </div>
        </div>
        <div className="what-hero-media">
          <Photo media={content.heroImage} sizes="(min-width: 1024px) 52vw, 100vw" preload />
          <p>{content.hero.caption}</p>
        </div>
        <ol className="what-hero-index" aria-label={content.programs.heading}>
          {content.programs.items.map((program) => <li key={program.number}><span>{program.number}</span>{program.heading}</li>)}
        </ol>
      </div>
    </section>

    <section className="section what-connected" aria-labelledby="what-connected-heading">
      <div className="container what-connected-grid">
        <div><p className="eyebrow">{content.connected.eyebrow}</p><h2 id="what-connected-heading">{content.connected.heading}</h2></div>
        <div>{content.connected.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<strong>{content.connected.note}</strong></div>
      </div>
    </section>

    <section className="what-programs" id="program-areas" aria-labelledby="program-areas-heading">
      <div className="section section--paper what-programs-intro">
        <div className="container what-programs-head">
          <div><p className="eyebrow">{content.programs.eyebrow}</p><h2 id="program-areas-heading">{content.programs.heading}</h2></div>
          <p className="lede">{content.programs.description}</p>
        </div>
      </div>

      <article className="section what-program what-program--youth" aria-labelledby={`program-${youth.id}`}>
        <div className="container what-youth-grid">
          <Photo media={youth.image!} sizes="(min-width: 768px) 56vw, 100vw" />
          <div className="what-program-copy">
            <p className="what-program-number">{youth.number}</p>
            <h2 id={`program-${youth.id}`}>{youth.heading}</h2>
            <p>{youth.description}</p>
            <ProgramThemes themes={youth.themes} />
            <TextLink link={{ label: youth.cta, href: youth.href }} />
          </div>
        </div>
      </article>

      <article className="section section--paper what-program what-program--education" aria-labelledby={`program-${education.id}`}>
        <div className="container what-education-grid">
          <div className="what-program-copy">
            <p className="what-program-number">{education.number}</p>
            <h2 id={`program-${education.id}`}>{education.heading}</h2>
            <p>{education.description}</p>
            <TextLink link={{ label: education.cta, href: education.href }} />
          </div>
          <Photo media={education.image!} sizes="(min-width: 768px) 48vw, 100vw" />
          <ProgramThemes themes={education.themes} />
        </div>
      </article>

      <article className="what-readiness" aria-labelledby={`program-${readiness.id}`}>
        <div className="container what-readiness-grid">
          <div className="what-readiness-copy"><p className="what-program-number">{readiness.number}</p><h2 id={`program-${readiness.id}`}>{readiness.heading}</h2><p>{readiness.description}</p><TextLink link={{ label: readiness.cta, href: readiness.href }} /></div>
          <ProgramThemes themes={readiness.themes} />
        </div>
      </article>

      <article className="what-vocational" aria-labelledby={`program-${vocational.id}`}>
        <div className="container what-vocational-grid">
          <div className="what-program-copy">
            <p className="what-program-number">{vocational.number}</p>
            <h2 id={`program-${vocational.id}`}>{vocational.heading}</h2>
            <p>{vocational.description}</p>
            <ProgramThemes themes={vocational.themes} />
            <Action link={{ label: vocational.cta, href: vocational.href }} variant="secondary" />
          </div>
          <Photo media={vocational.image!} sizes="(min-width: 768px) 48vw, 100vw" />
        </div>
      </article>

      <article className="section what-program what-program--community" aria-labelledby={`program-${community.id}`}>
        <div className="container what-community-grid">
          <div className="what-community-media">
            <Photo media={community.image!} sizes="(min-width: 768px) 42vw, 100vw" />
            <p className="archive-caption">{content.programs.location}</p>
          </div>
          <div className="what-program-copy">
            <p className="what-program-number">{community.number}</p>
            <h2 id={`program-${community.id}`}>{community.heading}</h2>
            <p>{community.description}</p>
            <ProgramThemes themes={community.themes} />
            <TextLink link={{ label: community.cta, href: community.href }} />
          </div>
        </div>
      </article>
    </section>

    <section className="section section--paper what-pathway" id="dove-pathway" aria-labelledby="what-pathway-heading">
      <div className="container">
        <div className="what-pathway-head"><div><p className="eyebrow">{content.pathway.eyebrow}</p><h2 id="what-pathway-heading">{content.pathway.heading}</h2></div><p className="lede">{content.pathway.description}</p></div>
        <ol className="what-pathway-flow">
          {content.pathway.stages.map((stage, index) => <li key={stage.verb}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage.verb}</strong>
            <h3>{stage.program}</h3>
            <p>{stage.detail}</p>
          </li>)}
        </ol>
        <p className="what-pathway-note">{content.pathway.note}</p>
      </div>
    </section>

    <section className="section what-outcome" aria-labelledby="what-outcome-heading">
      <div className="container what-outcome-grid">
        <p className="eyebrow">{content.outcome.eyebrow}</p><h2 id="what-outcome-heading">{content.outcome.heading}</h2><p className="lede">{content.outcome.description}</p><TextLink link={content.outcomeLink} />
      </div>
    </section>

    <Newsletter home={home} />

    <section className="final-cta what-final" aria-labelledby="what-final-heading">
      <div className="container"><p className="pill">{content.closing.eyebrow}</p><h2 id="what-final-heading">{content.closing.heading}</h2><p>{content.closing.description}</p><div className="final-actions"><Action link={content.closingLinks.primary} /><Action link={content.closingLinks.secondary} variant="secondary" /></div></div>
    </section>
  </>;
}
