import type { VolunteerContent } from "@/content/volunteer";
import type { HomeContent } from "@/content/home";
import { Action, Photo, SectionHeading, TextLink } from "./ui";
import Newsletter from "./Newsletter";
import VolunteerHeroVideo from "./VolunteerHeroVideo";
import VolunteerApplicationForm from "./VolunteerApplicationForm";

export default function VolunteerPage({ content, home }: { content: VolunteerContent; home: HomeContent }) {
  return <>
    <VolunteerHeroVideo content={content} />

    <section className="volunteer-invitation section section--paper" aria-labelledby="volunteer-invitation-heading">
      <div className="container volunteer-invitation-grid">
        <SectionHeading eyebrow={content.invitation.eyebrow} title={content.invitation.heading} id="volunteer-invitation-heading" />
        <div className="volunteer-invitation-copy">
          {content.invitation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="volunteer-principle">{content.invitation.note}</p>
        </div>
      </div>
    </section>

    <section id="day-with-dove" className="volunteer-day section" aria-labelledby="volunteer-day-heading">
      <div className="container">
        <div className="volunteer-day-intro">
          <SectionHeading eyebrow={content.day.eyebrow} title={content.day.heading} description={content.day.description} id="volunteer-day-heading" />
        </div>
        <ol className="volunteer-dayline">
          {content.day.stages.map((stage, index) => <li key={stage.title}>
            <span className="volunteer-day-number">{String(index + 1).padStart(2, "0")}</span>
            <div><p className="volunteer-day-time">{stage.time}</p><h3>{stage.title}</h3><p>{stage.description}</p></div>
            {index === 1 && <Photo className="volunteer-day-photo volunteer-day-photo--face" media={content.media.facePainting} sizes="(min-width: 768px) 38vw, 100vw" />}
            {index === 3 && <Photo className="volunteer-day-photo volunteer-day-photo--snack" media={content.media.snackPreparation} sizes="(min-width: 768px) 38vw, 100vw" />}
          </li>)}
        </ol>
      </div>
    </section>

    <section className="volunteer-connection" aria-labelledby="volunteer-connection-heading">
      <Photo media={content.media.groupCircle} sizes="100vw" className="volunteer-connection-photo" />
      <div className="volunteer-connection-overlay" aria-hidden="true" />
      <div className="container volunteer-connection-copy">
        <p className="eyebrow">{content.connection.eyebrow}</p>
        <h2 id="volunteer-connection-heading">{content.connection.heading}</h2>
        <p>{content.connection.description}</p>
      </div>
    </section>

    <section className="volunteer-participation section section--paper" aria-labelledby="volunteer-participation-heading">
      <div className="container volunteer-participation-grid">
        <SectionHeading eyebrow={content.participation.eyebrow} title={content.participation.heading}
          description={content.participation.description} id="volunteer-participation-heading" />
        <ul>{content.participation.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ul>
      </div>
    </section>

    <section className="volunteer-prepare" aria-labelledby="volunteer-prepare-heading">
      <div className="container volunteer-prepare-grid">
        <div>
          <p className="eyebrow">{content.prepare.eyebrow}</p>
          <h2 id="volunteer-prepare-heading">{content.prepare.heading}</h2>
          <p>{content.prepare.description}</p>
          <div className="volunteer-prepare-actions"><Action link={content.prepareLinks.guidelines} variant="primary" /><TextLink link={content.prepareLinks.email} /></div>
        </div>
        <ul>{content.prepare.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </div>
    </section>

    <section className="volunteer-start section" aria-labelledby="volunteer-start-heading">
      <div className="container">
        <SectionHeading eyebrow={content.start.eyebrow} title={content.start.heading} id="volunteer-start-heading" />
        <ol>{content.start.steps.map((step, index) => <li key={step.title}>
          <span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p>
        </li>)}</ol>
        <Action link={content.startLink} variant="teal" />
      </div>
    </section>

    <section id="application" className="volunteer-application section section--paper" aria-labelledby="volunteer-application-heading">
      <div className="container">
        <div className="volunteer-application-intro" id="volunteer-form-intro">
          <SectionHeading eyebrow={content.application.eyebrow} title={content.application.heading}
            description={content.application.description} id="volunteer-application-heading" />
        </div>
        <VolunteerApplicationForm content={content} />
      </div>
    </section>

    <section className="volunteer-group" aria-labelledby="volunteer-group-heading">
      <div className="container volunteer-group-grid">
        <p className="eyebrow">{content.group.eyebrow}</p>
        <div><h2 id="volunteer-group-heading">{content.group.heading}</h2><p>{content.group.description}</p></div>
        <Action link={content.groupLink} variant="secondary" />
      </div>
    </section>
    <Newsletter home={home} />
  </>;
}
