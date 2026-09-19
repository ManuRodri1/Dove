import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { PublicStorySummary } from "@/lib/cms/public-stories";
import StoryCard from "./StoryCard";
import StorySearch from "./StorySearch";
import { getStoriesCopy } from "@/content/stories-ui";

type Props = {
  locale: Locale;
  items: PublicStorySummary[];
  lead: PublicStorySummary | null;
  total: number;
  page: number;
  pageSize: number;
  query: string;
};

const rhythm = (index: number): "horizontal" | "standard" | "compact" => {
  if (index > 0 && index % 6 === 5) return "horizontal";
  if (index >= 2 && index <= 4) return "compact";
  return "standard";
};

export default function StoryArchive({ locale, items, lead, total, page, pageSize, query }: Props) {
  const copy = getStoriesCopy(locale);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageHref = (value: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (value > 1) params.set("page", String(value));
    return `/${locale}/stories${params.size ? `?${params}` : ""}`;
  };

  return <>
    <section className="stories-public-hero" aria-labelledby="stories-title">
      <div className="container stories-public-hero-grid">
        <div><p className="eyebrow">{copy.index.eyebrow}</p><h1 id="stories-title">{copy.index.title}</h1></div>
        <p className="lede">{copy.index.introduction}</p>
      </div>
    </section>
    <section className="stories-index section" aria-labelledby="latest-stories-heading">
      <div className="container stories-index-inner">
        <StorySearch label={copy.index.searchLabel} placeholder={copy.index.searchPlaceholder} clear={copy.index.clearSearch} />
        {!items.length && !lead ? <div className="stories-empty">
          <h2 id="latest-stories-heading">{query ? copy.index.emptyTitle : copy.index.noPublishedTitle}</h2>
          <p>{query ? copy.index.emptyText : copy.index.noPublishedText}</p>
        </div> : <>
          {lead && <div className="stories-lead">
            <p className="stories-lead-label">{copy.index.featuredLabel}</p>
            <StoryCard story={lead} variant="lead" readLabel={copy.index.readStory} />
          </div>}
          <div className="stories-archive-head">
            <h2 id="latest-stories-heading">{copy.index.archiveHeading}</h2>
            <p>{copy.index.archiveIntroduction}</p>
          </div>
          <div className="stories-archive">
            {items.map((story, index) => <StoryCard key={story.id} story={story} variant={rhythm(index)} readLabel={copy.index.readStory} />)}
          </div>
          {pages > 1 && <nav className="story-pagination" aria-label={copy.labels.page}>
            <span>{page > 1 ? <Link href={pageHref(page - 1)}>← {copy.labels.previous}</Link> : null}</span>
            <span>{copy.labels.page} {page} / {pages}</span>
            <span>{page < pages ? <Link href={pageHref(page + 1)}>{copy.labels.next} →</Link> : null}</span>
          </nav>}
        </>}
      </div>
    </section>
  </>;
}

