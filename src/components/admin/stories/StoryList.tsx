"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { duplicateStoryAction, setStoryStatusAction } from "@/app/admin/stories/actions";
import type { AdminStorySummary } from "@/lib/cms/admin-queries";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function StoryList({ stories, now }: { stories: AdminStorySummary[]; now: number }) {
  const router = useRouter();
  const [working, setWorking] = useState<string | null>(null);
  const run = async (id: string, action: () => Promise<{ success: boolean; error?: string }>) => {
    setWorking(id);
    const result = await action();
    setWorking(null);
    if (!result.success) window.alert(result.error ?? "Action failed");
    router.refresh();
  };
  if (!stories.length) return <div className="admin-empty"><h2>No stories match</h2><p>Change the filters or start a new story.</p></div>;

  return <div className="admin-story-list">{stories.map((story) => {
    const primary = story.translations.find((item) => item.locale === "en") ?? story.translations[0];
    const cover = Array.isArray(story.cover_media) ? story.cover_media[0] : story.cover_media;
    const scheduled = story.scheduled_at && Date.parse(story.scheduled_at) > now && story.status !== "archived";
    const status = scheduled ? "scheduled" : story.status;
    return (
      <article className="admin-story-row" key={story.id}>
        <div className="admin-story-thumb">{cover?.url ? <Image src={cover.url} alt="" fill sizes="112px" /> : <span>No cover</span>}</div>
        <div className="admin-story-copy">
          <div className="admin-story-meta"><span data-status={status}>{status}</span>{story.translations.map((translation) => <span key={translation.id}>{translation.locale.toUpperCase()}</span>)}</div>
          <h2><Link href={`/admin/stories/${story.id}`}>{primary?.title || "Untitled story"}</Link></h2>
          <dl><div><dt>Published</dt><dd>{formatDate(story.published_at)}</dd></div><div><dt>Updated</dt><dd>{formatDate(story.updated_at)}</dd></div></dl>
        </div>
        <div className="admin-story-featured">{story.featured_stories && <span>Stories feature</span>}{story.featured_home && <span>Home feature</span>}</div>
        <div className="admin-row-actions">
          <Link href={`/admin/stories/${story.id}`}>Edit</Link>
          {primary?.publication_status === "published" && story.status === "published" && <Link href={`/${primary.locale}/stories/${primary.slug}`} target="_blank">Preview<span className="sr-only"> {primary.title}</span></Link>}
          <details><summary>More</summary><div>
            <button disabled={working === story.id} onClick={() => run(story.id, () => duplicateStoryAction(story.id))}>Duplicate</button>
            <button disabled={working === story.id} onClick={() => run(story.id, () => setStoryStatusAction(story.id, story.status === "published" ? "draft" : "published"))}>{story.status === "published" ? "Move to draft" : "Publish"}</button>
            <button disabled={working === story.id || story.status === "archived"} onClick={() => window.confirm("Archive this story?") && run(story.id, () => setStoryStatusAction(story.id, "archived"))}>Archive</button>
          </div></details>
        </div>
      </article>
    );
  })}</div>;
}
