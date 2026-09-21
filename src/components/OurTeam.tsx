/* Hallmark · genre: warm editorial nonprofit · macrostructure: Photographic / Portrait Ledger · theme: locked Dove system
 * enrichment: E2 poster-first privacy-enhanced YouTube hero and source-verified portraits
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import Image from "next/image";
import type { HomeContent } from "@/content/home";
import type { TeamContent, TeamPerson } from "@/content/team";
import { Action, TextLink } from "./ui";
import OurTeamHeroVideo from "./OurTeamHeroVideo";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
}

function Portrait({ person, sizes }: { person: TeamPerson; sizes: string }) {
  return <div className={`team-portrait ${person.image ? "" : "team-portrait--empty"}`}>
    {person.image ? <Image src={person.image.src} alt={person.image.alt} fill sizes={sizes} style={{ objectPosition: person.image.position }} /> :
      <span aria-hidden="true">{initials(person.name)}</span>}
  </div>;
}

function EmailLink({ person, label }: { person: TeamPerson; label: string }) {
  if (!person.email) return null;
  return <a className="team-email" href={`mailto:${person.email}`} aria-label={`${label} ${person.name}: ${person.email}`}>
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6.5h18v11H3zM4 7l8 6 8-6" /></svg>
    <span>{label} {person.name.split(" ")[0]}</span>
  </a>;
}

export default function OurTeam({ content }: { content: TeamContent; home: HomeContent }) {
  return <>
    <OurTeamHeroVideo content={content} />

    <section className="team-leadership section" aria-labelledby="team-leadership-heading">
      <div className="container team-leadership-grid">
        <Portrait person={content.leader} sizes="(min-width: 768px) 46vw, 100vw" />
        <div className="team-leadership-copy">
          <p className="eyebrow">{content.leadership.eyebrow}</p>
          <h2 id="team-leadership-heading">{content.leadership.heading}</h2>
          <p className="team-role">{content.leadership.role}</p>
          <p className="lede">{content.leadership.description}</p>
          <div className="team-leadership-actions">
            <TextLink link={content.leadershipLinks.story} />
            <EmailLink person={content.leader} label={content.emailLabel} />
          </div>
        </div>
      </div>
    </section>

    <section className="team-staff section section--paper" aria-labelledby="team-staff-heading">
      <div className="container">
        <div className="team-section-head">
          <div><p className="eyebrow">{content.staff.eyebrow}</p><h2 id="team-staff-heading">{content.staff.heading}</h2></div>
          <p className="lede">{content.staff.description}</p>
        </div>
        <div className="team-staff-grid">
          {content.staffPeople.map((person, index) => <article className={index < 2 ? "team-person team-person--staff-lead" : "team-person"} key={person.id}>
            <Portrait person={person} sizes={index < 2 ? "(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 100vw"} />
            <div className="team-person-copy"><h3>{person.name}</h3>{person.role && <p className="team-role">{person.role}</p>}<EmailLink person={person} label={content.emailLabel} /></div>
          </article>)}
        </div>
      </div>
    </section>

    <aside className="team-breather" aria-label={content.breather}>
      <div className="container"><p>{content.breather}</p></div>
    </aside>

    <section className="team-board section" aria-labelledby="team-board-heading">
      <div className="container team-board-layout">
        <div className="team-board-intro"><p className="eyebrow">{content.board.eyebrow}</p><h2 id="team-board-heading">{content.board.heading}</h2><p className="lede">{content.board.description}</p></div>
        <div className="team-board-list">
          {content.boardPeople.map((person) => <article className="team-board-person" key={person.id}>
            <Portrait person={person} sizes="10rem" />
            <div><h3>{person.name}</h3><p className="team-role">{person.role}</p>{person.context.map((line) => <p className="team-context" key={line}>{line}</p>)}</div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="team-dominican section section--paper" aria-labelledby="team-dominican-heading">
      <div className="container">
        <div className="team-section-head team-dominican-head"><div><p className="eyebrow">{content.dominicanBoard.eyebrow}</p><h2 id="team-dominican-heading">{content.dominicanBoard.heading}</h2></div><p className="lede">{content.dominicanBoard.description}</p></div>
        <div className="team-dominican-grid">
          {content.dominicanBoardPeople.map((person) => <article className="team-dominican-person" key={person.id}>
            <Portrait person={person} sizes="(min-width: 1024px) 13vw, (min-width: 640px) 24vw, 42vw" />
            <div><h3>{person.name}</h3><p className="team-role">{person.role}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="final-cta team-final" aria-labelledby="team-final-heading">
      <div className="container"><p className="pill">{content.closing.eyebrow}</p><h2 id="team-final-heading">{content.closing.heading}</h2><p>{content.closing.description}</p><div className="final-actions"><Action link={content.closingLinks.contact} /><Action link={content.closingLinks.story} variant="secondary" /></div></div>
    </section>
  </>;
}
