/* Hallmark · pre-emit critique: P5 H5 E4 S5 R5 V5 */
import type { HomeContent } from "@/content/home";
import { type OurStoryContent, ourStoryVideos } from "@/content/our-story";
import { doveMedia } from "@/content/dove-media";
import { Action, Photo } from "./ui";
import StoryVideo from "./StoryVideo";

export default function OurStory({ home, story }: { home: HomeContent; story: OurStoryContent }) {
  const videos = ourStoryVideos.filter((video) => video.verified && video.locale === home.locale);
  return <>
    <section className="story-hero section" aria-labelledby="story-heading">
      <div className="container">
        <div className="story-hero-copy"><p className="eyebrow">{story.eyebrow}</p><h1 id="story-heading">{story.heading}</h1><p className="lede">{story.introduction}</p></div>
        <Photo media={{ ...doveMedia.history.primary, alt: story.heroAlt }} className="story-hero-photo" sizes="(min-width: 1280px) 1176px, 100vw" preload />
        <p className="archive-caption">{story.archive}</p>
      </div>
    </section>
    <div className="story-timeline" aria-label={story.timeline}>
      {story.eras.map((era, index) => <section className={`story-era section ${index % 2 === 0 ? "section--paper" : ""}`} key={era.number} aria-labelledby={`era-${era.number}`}>
        <div className="container">
          <div className="era-heading"><p className="era-years">{era.years}</p><div><p className="eyebrow">{era.number} / 04</p><h2 id={`era-${era.number}`}>{era.heading}</h2></div></div>
          <div className={`era-body ${index % 2 === 1 ? "era-body--reverse" : ""}`}>
            <div className="era-photo-column"><Photo media={{ ...era.image, alt: era.alt }} /><p className="archive-caption">{story.archive}</p></div>
            <div className="era-copy"><p className="lede">{era.narrative}</p><ol className="era-milestones">{era.milestones.map((milestone) => <li key={milestone.date}><span className="milestone-date">{milestone.date}</span><p>{milestone.label}</p></li>)}</ol>
              {index === 3 && <div className="story-skills"><h3>{story.skillsLabel}</h3><ul>{story.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>}
            </div>
          </div>
          {index === 0 && <aside className="first-generation" aria-labelledby="first-generation-heading"><div className="first-number"><strong>{story.first.number}</strong><span>{story.first.caption}</span></div><div><p className="eyebrow">{story.first.eyebrow}</p><h3 id="first-generation-heading">{story.first.heading}</h3><p>{story.first.text}</p></div></aside>}
        </div>
      </section>)}
    </div>
    <section className="section story-today" aria-labelledby="today-heading"><div className="container"><p className="eyebrow">{story.today.eyebrow}</p><h2 id="today-heading">{story.today.heading}</h2><p className="lede">{story.today.text}</p></div></section>
    {videos.length > 0 && <section className="section" aria-labelledby="story-videos-heading"><div className="container"><h2 id="story-videos-heading">{story.videosHeading}</h2>{videos.map((video) => <StoryVideo key={video.youtubeId} video={video} playLabel={story.videoPlay} consent={story.videoConsent} />)}</div></section>}
    <section className="final-cta" aria-labelledby="story-final-heading"><div className="container"><p className="pill">{story.closing.eyebrow}</p><h2 id="story-final-heading">{story.closing.heading}</h2><p>{story.closing.description}</p><div className="final-actions"><Action link={home.actions.sponsor} /><Action link={home.actions.donate} variant="secondary" /></div></div></section>
  </>;
}
