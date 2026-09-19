import Link from "next/link";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { getAdminNow, listAdminStories } from "@/lib/cms/admin-queries";
import StoryList from "@/components/admin/stories/StoryList";

type StorySearch = { q?: string; status?: string; locale?: string; sort?: string };

export default async function AdminStoriesPage({ searchParams }: { searchParams: Promise<StorySearch> }) {
  if (!(await getStaffSession())) redirect("/admin/login");
  const filters = await searchParams;
  const now = getAdminNow();
  let stories = await listAdminStories();
  const query = filters.q?.trim().toLocaleLowerCase();
  if (query) stories = stories.filter((story) => story.translations.some((translation) => `${translation.title} ${translation.excerpt}`.toLocaleLowerCase().includes(query)));
  if (filters.status === "scheduled") stories = stories.filter((story) => story.scheduled_at && Date.parse(story.scheduled_at) > now && story.status !== "archived");
  else if (filters.status) stories = stories.filter((story) => story.status === filters.status);
  if (filters.locale) stories = stories.filter((story) => story.translations.some((translation) => translation.locale === filters.locale));
  if (filters.sort === "published") stories.sort((a, b) => Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? ""));
  else if (filters.sort === "title") stories.sort((a, b) => (a.translations[0]?.title ?? "").localeCompare(b.translations[0]?.title ?? ""));
  else stories.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><p className="admin-kicker">Editorial library</p><h1>Stories</h1><p>{stories.length} result{stories.length === 1 ? "" : "s"}. Search, review, and publish Dove&apos;s English and Spanish reporting.</p></div>
        <Link className="admin-primary" href="/admin/stories/new">New story</Link>
      </header>
      <form className="admin-filters" method="GET">
        <label className="admin-filter-search"><span>Search stories</span><input type="search" name="q" defaultValue={filters.q} placeholder="Title or excerpt" /></label>
        <label><span>Status</span><select name="status" defaultValue={filters.status ?? ""}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></select></label>
        <label><span>Locale</span><select name="locale" defaultValue={filters.locale ?? ""}><option value="">All locales</option><option value="en">English</option><option value="es">Español</option></select></label>
        <label><span>Sort by</span><select name="sort" defaultValue={filters.sort ?? "updated"}><option value="updated">Recently updated</option><option value="published">Publication date</option><option value="title">Title</option></select></label>
        <button className="admin-secondary" type="submit">Apply</button>
      </form>
      <StoryList stories={stories} now={now} />
    </div>
  );
}
