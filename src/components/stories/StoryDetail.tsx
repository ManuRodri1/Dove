import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/content/home";
import type { PublicStoryDetail, PublicStorySummary } from "@/lib/cms/public-stories";
import { formatStoryDate, getStoriesCopy } from "@/content/stories-ui";
import StoryRenderer from "./StoryRenderer";
import StoryCard from "./StoryCard";
import Newsletter from "@/components/Newsletter";
import { Action } from "@/components/ui";

export default function StoryDetail({ story, recent, home }: { story: PublicStoryDetail; recent: PublicStorySummary[]; home: HomeContent }) {
  const copy = getStoriesCopy(story.locale);
  const archiveHref = `/${story.locale}/stories`;
  return <>
    <article className="story-detail">
      <header className="story-detail-header">
        <div className="container story-detail-header-grid">
          <div className="story-detail-header-copy">
            <Link className="text-link" href={archiveHref}>← {copy.detail.back}</Link>
            <h1>{story.title}</h1>
            {story.excerpt && <p className="lede">{story.excerpt}</p>}
            <div className="story-byline">
              {story.authorName && <span>{story.authorName}</span>}
              <time dateTime={story.publishedAt}>{formatStoryDate(story.publishedAt, story.locale)}</time>
              <span>{story.readingMinutes} {copy.detail.minRead}</span>
            </div>
          </div>
          {story.coverImage && <div className="story-cover"><Image src={story.coverImage.url} alt={story.coverImage.alt} fill priority sizes="(min-width: 900px) 45vw, 100vw" style={{ objectFit: "cover", objectPosition: `${(story.coverImage.focalX ?? .5) * 100}% ${(story.coverImage.focalY ?? .5) * 100}%` }} /></div>}
        </div>
      </header>
      <StoryRenderer blocks={story.blocks} />
      <div className="story-detail-back-end"><Link className="text-link" href={archiveHref}>← {copy.detail.back}</Link></div>
    </article>
    {recent.length > 0 && <section className="story-recent section" aria-labelledby="continue-reading-heading">
      <div className="container">
        <div className="story-recent-head"><p className="eyebrow">{copy.detail.continueEyebrow}</p><h2 id="continue-reading-heading">{copy.detail.recent}</h2></div>
        <div className="story-recent-grid">{recent.map((item, index) => <StoryCard story={item} variant={index === 0 ? "horizontal" : "compact"} readLabel={copy.index.readStory} key={item.id} />)}</div>
      </div>
    </section>}
    <Newsletter home={home} />
    <section className="final-cta"><div className="container">
      <p className="pill">{copy.detail.ctaEyebrow}</p><h2>{copy.detail.ctaTitle}</h2><p>{copy.detail.ctaText}</p>
      <div className="final-actions"><Action link={home.actions.donate} /><Action link={home.actions.sponsor} variant="secondary" /></div>
    </div></section>
  </>;
}

