import Image from "next/image";
import Link from "next/link";
import type { PublicStorySummary } from "@/lib/cms/public-stories";
import { formatStoryDate } from "@/content/stories-ui";

type Variant = "lead" | "horizontal" | "standard" | "compact";

export default function StoryCard({ story, variant = "standard", readLabel }: { story: PublicStorySummary; variant?: Variant; readLabel: string }) {
  const Heading = variant === "lead" ? "h2" : "h3";
  return <article className={`archive-story archive-story--${variant}`}>
    {story.coverImage ? <Link className="archive-story-media" href={story.href} tabIndex={-1} aria-hidden="true">
      <Image src={story.coverImage.url} alt="" fill sizes={variant === "lead" ? "(min-width: 768px) 58vw, 100vw" : variant === "horizontal" ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 100vw"} style={{ objectFit: "cover", objectPosition: `${(story.coverImage.focalX ?? .5) * 100}% ${(story.coverImage.focalY ?? .5) * 100}%` }} />
    </Link> : <div className="archive-story-media archive-story-media--empty" aria-hidden="true"><span>Dove</span></div>}
    <div className="archive-story-copy">
      {story.categories[0]?.name && <p className="archive-meta">{story.categories[0].name}</p>}
      <Heading><Link href={story.href}>{story.title}</Link></Heading>
      {story.excerpt && <p>{story.excerpt}</p>}
      <div className="archive-story-foot">
        <time dateTime={story.publishedAt}>{formatStoryDate(story.publishedAt, story.locale)}</time>
        <Link className="text-link" href={story.href}>{readLabel}<span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </article>;
}

