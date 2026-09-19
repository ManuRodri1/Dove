import Link from "next/link";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { getAdminDashboard } from "@/lib/cms/admin-queries";

function formatDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const staff = await getStaffSession();
  if (!staff) redirect("/admin/login");
  const dashboard = await getAdminDashboard();
  const metrics = [
    ["Total stories", dashboard.counts.total],
    ["Published", dashboard.counts.published],
    ["Drafts", dashboard.counts.drafts],
    ["Scheduled", dashboard.counts.scheduled],
    ["Media assets", dashboard.counts.media],
  ] as const;

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><p className="admin-kicker">Editorial overview</p><h1>Good to see you, {staff.displayName}.</h1><p>Keep Dove&apos;s stories current, clear, and ready to publish.</p></div>
        <Link className="admin-primary" href="/admin/stories/new">New story</Link>
      </header>
      <section className="admin-metrics" aria-label="Content totals">
        {metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </section>
      <div className="admin-dashboard-columns">
        <section className="admin-ledger">
          <header><div><p className="admin-kicker">Published</p><h2>Recent stories</h2></div><Link href="/admin/stories?status=published">View all</Link></header>
          {dashboard.recentStories.length ? <ol>{dashboard.recentStories.map((story) => <li key={story.id}><Link href={`/admin/stories/${story.id}`}>{story.title}</Link><span>{formatDate(story.publishedAt)}</span></li>)}</ol> : <p className="admin-empty-inline">No published stories yet.</p>}
        </section>
        <section className="admin-ledger">
          <header><div><p className="admin-kicker">Activity</p><h2>Recently updated</h2></div><Link href="/admin/stories?sort=updated">View all</Link></header>
          {dashboard.recentlyUpdated.length ? <ol>{dashboard.recentlyUpdated.map((story) => <li key={story.id}><Link href={`/admin/stories/${story.id}`}>{story.title}</Link><span>{formatDate(story.updatedAt)} · {story.status}</span></li>)}</ol> : <p className="admin-empty-inline">No recent changes.</p>}
        </section>
      </div>
    </div>
  );
}
