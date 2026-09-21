import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/content/home";
import type { Story } from "@/content/stories";
import { formatStoryDate } from "@/content/stories-ui";
import { SectionHeading, TextLink } from "./ui";

export default function StoriesFromDove({ stories, home }: { stories: Story[]; home: HomeContent }) {
  const visible = stories.filter((story) => story.status === "published" && story.verified).slice(0, 3);
  if (!visible.length) return null;
  return <section className="section home-stories" aria-labelledby="stories-heading">
    <div className="container">
      <div className="home-stories-head">
        <SectionHeading eyebrow={home.stories.eyebrow} title={home.stories.heading} id="stories-heading" />
        <div><p className="home-stories-intro">{home.stories.introduction}</p><TextLink link={home.stories.link} /></div>
      </div>
      <div className="home-stories-layout">
        {visible.map((story, index) => {
          const isFallback = home.locale === "es" && story.locale === "en";
          return (
            <article className={`home-story ${index === 0 ? "home-story--lead" : "home-story--support"}`} key={story.id}>
              {story.image && story.href ? (
                <Link className="home-story-media" href={story.href} tabIndex={-1} aria-hidden="true">
                  <Image
                    src={story.image.src}
                    alt=""
                    fill
                    sizes={index === 0 ? "(min-width: 768px) 62vw, 100vw" : "(min-width: 768px) 18vw, 100vw"}
                    style={{ objectFit: "cover" }}
                  />
                </Link>
              ) : (
                <div className="home-story-media home-story-media--empty" aria-hidden="true">
                  <span>Dove</span>
                </div>
              )}
              <div className="home-story-copy">
                {(story.category || isFallback) && (
                  <div className="home-story-meta-row">
                    {story.category && <p className="archive-meta">{story.category}</p>}
                    {isFallback && (
                      <span className="story-lang-badge" title="Historia en inglés / Story in English" aria-label="In English">
                        EN
                      </span>
                    )}
                  </div>
                )}
                <h3>{story.href ? <Link href={story.href}>{story.title}</Link> : story.title}</h3>
                {story.excerpt && <p>{story.excerpt}</p>}
                {story.publishedAt && <time className="home-story-date" dateTime={story.publishedAt}>{formatStoryDate(story.publishedAt, story.locale)}</time>}
                {story.href && <TextLink link={{ label: isFallback ? "Read story (EN)" : home.ui.readStory, href: story.href }} />}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>;
}

