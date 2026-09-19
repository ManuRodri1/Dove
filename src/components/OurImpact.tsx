import type { HomeContent } from "@/content/home";
import type { OurImpactContent } from "@/content/our-impact";
import { Action, Photo, TextLink } from "./ui";

export default function OurImpact({
  content,
  home,
}: {
  content: OurImpactContent;
  home: HomeContent;
}) {
  return (
    <div className="impact-page">
      {/* SECTION 01 — HERO */}
      <section className="impact-hero section" aria-labelledby="impact-hero-heading">
        <div className="container impact-hero-grid">
          <div className="impact-hero-copy">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="impact-hero-heading">{content.hero.heading}</h1>
            <p className="lede">{content.hero.description}</p>
            <div className="impact-hero-actions">
              <Action link={content.hero.primaryCta} />
              <Action link={content.hero.secondaryCta} variant="secondary" />
            </div>
          </div>
          <div className="impact-hero-media">
            <Photo media={content.hero.image} sizes="(min-width: 1024px) 52vw, 100vw" preload />
            <p className="impact-media-caption">{content.hero.caption}</p>
          </div>
        </div>
      </section>

      {/* SECTION 02 — IMPACT AT A GLANCE */}
      <section className="impact-glance section section--paper" aria-labelledby="impact-glance-heading">
        <div className="container">
          <div className="impact-glance-head">
            <p className="eyebrow">{content.impactGlance.eyebrow}</p>
            <h2 id="impact-glance-heading">{content.impactGlance.heading}</h2>
          </div>
          <ul className="impact-glance-strip">
            {content.impactGlance.metrics.map((metric) => (
              <li key={metric.value} className="impact-glance-item">
                <span className="impact-glance-val">{metric.value}</span>
                <strong className="impact-glance-label">{metric.label}</strong>
                <p className="impact-glance-context">{metric.context}</p>
              </li>
            ))}
          </ul>
          <p className="impact-glance-note">{content.impactGlance.footerNote}</p>
        </div>
      </section>

      {/* SECTION 03 — THE DOVE PATHWAY */}
      <section className="impact-pathway section" id="dove-pathway" aria-labelledby="impact-pathway-heading">
        <div className="container">
          <div className="impact-pathway-head">
            <p className="eyebrow">{content.pathway.eyebrow}</p>
            <h2 id="impact-pathway-heading">{content.pathway.heading}</h2>
            <p className="lede">{content.pathway.description}</p>
          </div>
          <ol className="impact-pathway-flow">
            {content.pathway.stages.map((stage) => (
              <li key={stage.number} className="impact-pathway-step">
                <span className="impact-pathway-num">{stage.number}</span>
                <h3 className="impact-pathway-title">{stage.title}</h3>
                <p className="impact-pathway-desc">{stage.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 04 — FEATURE STORY: JODELKA + ELIAN */}
      <section className="impact-story-feature section section--paper" aria-labelledby="jodelka-elian-heading">
        <div className="container impact-story-grid">
          <div className="impact-story-media">
            <Photo media={content.featureStory1.image} sizes="(min-width: 768px) 48vw, 100vw" />
          </div>
          <div className="impact-story-copy">
            <span className="impact-story-tag">{content.featureStory1.tag}</span>
            <h2 id="jodelka-elian-heading">{content.featureStory1.title}</h2>
            <p className="impact-story-text">{content.featureStory1.narrative}</p>
            <TextLink link={{ label: content.featureStory1.linkText, href: content.featureStory1.linkHref }} />
          </div>
        </div>
      </section>

      {/* SECTION 05 — HISTORICAL IMPACT SNAPSHOTS */}
      <section className="impact-snapshots section" aria-labelledby="impact-snapshots-heading">
        <div className="container">
          <div className="impact-snapshots-head">
            <p className="eyebrow">{content.historicalSnapshots.eyebrow}</p>
            <h2 id="impact-snapshots-heading">{content.historicalSnapshots.heading}</h2>
            <p className="lede">{content.historicalSnapshots.description}</p>
          </div>
          <div className="impact-snapshots-grid">
            {content.historicalSnapshots.snapshots.map((item) => (
              <article key={item.value} className="impact-snapshot-card">
                <span className="impact-snapshot-val">{item.value}</span>
                <h3>{item.label}</h3>
                <span className="impact-snapshot-tag">{item.period}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06 — FEATURE STORY: LEONELA */}
      <section className="impact-story-feature impact-story-feature--alt section section--paper" aria-labelledby="leonela-heading">
        <div className="container impact-story-grid">
          <div className="impact-story-copy">
            <span className="impact-story-tag">{content.featureStory2.tag}</span>
            <h2 id="leonela-heading">{content.featureStory2.title}</h2>
            <p className="impact-story-text">{content.featureStory2.narrative}</p>
            <TextLink link={{ label: content.featureStory2.linkText, href: content.featureStory2.linkHref }} />
          </div>
          <div className="impact-story-media">
            <Photo media={content.featureStory2.image} sizes="(min-width: 768px) 48vw, 100vw" />
          </div>
        </div>
      </section>

      {/* SECTION 07 — HOW IMPACT TAKES SHAPE */}
      <section className="impact-program-bridge section" aria-labelledby="program-bridge-heading">
        <div className="container">
          <div className="impact-program-head">
            <p className="eyebrow">{content.programBridge.eyebrow}</p>
            <h2 id="program-bridge-heading">{content.programBridge.heading}</h2>
            <p className="lede">{content.programBridge.description}</p>
          </div>
          <div className="impact-program-list">
            {content.programBridge.outcomes.map((item) => (
              <div key={item.title} className="impact-program-item">
                <h3>{item.title}</h3>
                <p>{item.enables}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 08 — STORIES & TRANSPARENCY BRIDGE */}
      <section className="impact-stories-bridge section section--paper" aria-labelledby="stories-bridge-heading">
        <div className="container impact-bridge-grid">
          <div className="impact-bridge-copy">
            <p className="eyebrow">{content.storiesBridge.eyebrow}</p>
            <h2 id="stories-bridge-heading">{content.storiesBridge.heading}</h2>
            <p className="lede">{content.storiesBridge.description}</p>
          </div>
          <div className="impact-bridge-actions">
            <Action link={content.storiesBridge.primaryCta} />
            <TextLink link={content.storiesBridge.secondaryCta} />
          </div>
        </div>
      </section>

      {/* SECTION 09 — FINAL CTA */}
      <section className="final-cta section" aria-labelledby="impact-cta-heading">
        <div className="container final-cta-inner">
          <h2 id="impact-cta-heading">{content.finalCta.heading}</h2>
          <p>{content.finalCta.description}</p>
          <div className="final-cta-actions">
            <Action link={content.finalCta.primaryAction} />
            <Action link={content.finalCta.secondaryAction} variant="secondary" />
          </div>
        </div>
      </section>
    </div>
  );
}
