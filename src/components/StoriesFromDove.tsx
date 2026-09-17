import type { HomeContent } from "@/content/home";
import type { Story } from "@/content/stories";
import { Photo, SectionHeading, TextLink } from "./ui";

export default function StoriesFromDove({ stories, home }: { stories: Story[]; home: HomeContent }) {
  const visible = stories.filter(
    (story) => (story.status === "published" && story.verified) || process.env.NODE_ENV === "development",
  );
  if (!visible.length) return null;
  return (
    <section className="section" aria-labelledby="stories-heading">
      <div className="container">
        <div className="stories-heading">
          <SectionHeading
            eyebrow={home.stories.eyebrow}
            title={home.stories.heading}
            id="stories-heading"
          />
          <TextLink link={home.stories.link} />
        </div>
        <div className="stories-grid">
          {visible.map((story, index) => (
            <article
              className={`story-card ${index === 0 ? "story-card--featured" : ""}`}
              key={story.slug}
              data-development={
                story.status === "draft" || undefined
              }
            >
              {story.image ? (
                <Photo media={story.image} />
              ) : (
                index === 0 && (
                  <div className="story-media-placeholder">
                    <span>{home.stories.mediaPending}</span>
                  </div>
                )
              )}
              <div className="story-copy">
                <p className="eyebrow">{story.category}</p>
                <h3>{story.title}</h3>
                {story.status === "draft" ? (
                  <p className="development-note">{home.stories.pending}</p>
                ) : (
                  <>
                    {story.excerpt && <p>{story.excerpt}</p>}
                    {story.href && <TextLink
                      link={{
                        label: home.ui.readStory,
                        href: story.href!,
                      }}
                    />}
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
