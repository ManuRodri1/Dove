import type { HomeContent } from "@/content/home";
import { doveMedia } from "@/content/dove-media";
import { Action, Icon, Photo, SectionHeading, TextLink } from "./ui";

export function OriginStory({ home }: { home: HomeContent }) {
  const content = home.history;
  return (
    <section className="section" aria-labelledby="history-heading">
      <div className="container split origin">
        <div>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.heading}
            id="history-heading"
            description={content.description}
          />
          <TextLink link={content.link} />
        </div>
        <Photo media={{ ...doveMedia.history.primary, alt: home.locale === "es" ? "Fotografía del archivo de Dove Missions en Puerto Plata" : doveMedia.history.primary.alt }} className="history-photo">
          <figcaption>
            <span>{content.caption}</span>
            <strong>{content.longevity}</strong>
          </figcaption>
        </Photo>
      </div>
    </section>
  );
}
export function DovePathway({ home }: { home: HomeContent }) {
  return (
    <section
      className="section section--paper"
      id="pathway"
      aria-labelledby="pathway-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={home.pathway.eyebrow}
          title={home.pathway.heading}
          description={home.pathway.description}
          id="pathway-heading"
        />
        <ol className="pathway">
          {home.pathway.steps.map((step, index) => (
            <li
              key={step.title}
              className={index === 6 ? "pathway-future" : ""}
            >
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="step-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="step-theme">{step.theme}</span>
              </div>
            </li>
          ))}
        </ol>
        <p className="pathway-note">{home.pathway.note}</p>
      </div>
    </section>
  );
}
export function SupportWays({ home }: { home: HomeContent }) {
  const support = home.support;
  return (
    <section
      className="section section--paper"
      id="support"
      aria-labelledby="support-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={support.eyebrow}
          title={support.heading}
          description={support.description}
          id="support-heading"
        />
        <div className="support-grid">
          <article className="sponsor-panel">
            <div>
              <p className="pill">{support.label}</p>
              <h3>{support.headingSponsor}</h3>
              <p className="sponsor-price">
                {support.price}
                <span>{support.period}</span>
              </p>
              <p className="sponsor-description">{support.sponsorCopy}</p>
            </div>
            <div className="sponsor-action">
              <Action link={home.actions.sponsor} />
            </div>
          </article>
          <div className="support-options">
            {support.options.map((option) => (
              <article className="support-option" key={option.title}>
                <div className="support-title">
                  <h3>{option.title}</h3>
                  <Icon name={option.icon} />
                </div>
                <p>{option.description}</p>
                <TextLink link={{ label: option.label, href: option.href }} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function ImpactStrip({ home }: { home: HomeContent }) {
  return (
    <section
      className="section impact"
      id="impact"
      aria-labelledby="impact-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={home.impact.eyebrow}
          title={home.impact.heading}
          description={home.impact.description}
          id="impact-heading"
        />
        <dl className="metrics">
          {home.impact.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                {metric.value === "—" ? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">{home.ui.unpublished}</span>
                  </>
                ) : (
                  metric.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
export function ExperienceDove({ home }: { home: HomeContent }) {
  return (
    <section
      className="section section--paper experience"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={home.experience.eyebrow}
          title={home.experience.heading}
          description={home.experience.description}
          id="experience-heading"
        />
        <div className="experience-grid">
          {home.experience.items.map((item) => (
            <article
              key={item.title}
              className={`experience-item ${item.image ? "" : "experience-partner"}`}
            >
              {item.image ? (
                <Photo
                  media={item.image}
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 100vw"
                />
              ) : (
                <Icon name="partner" />
              )}
              <div className="experience-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <TextLink link={item.link} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function PartnershipCallout({ home }: { home: HomeContent }) {
  return (
    <section
      className="partnership-section"
      aria-labelledby="partnership-heading"
    >
      <div className="container partnership">
        <SectionHeading
          eyebrow={home.partnership.eyebrow}
          title={home.partnership.heading}
          description={home.partnership.description}
          id="partnership-heading"
        />
        <Action link={home.partnership.link} variant="teal" />
      </div>
    </section>
  );
}
export function FinalCTA({ home }: { home: HomeContent }) {
  return (
    <section className="final-cta" aria-labelledby="final-heading">
      <div className="container">
        <p className="pill">{home.final.eyebrow}</p>
        <h2 id="final-heading">{home.final.heading}</h2>
        <p>{home.final.description}</p>
        <div className="final-actions">
          <Action link={home.actions.sponsor} />
          <Action link={home.actions.donate} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
