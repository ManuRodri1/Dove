import Link from "next/link";
import { redirect } from "next/navigation";
import CampaignList from "@/components/admin/campaigns/CampaignList";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { listAdminCampaigns } from "@/lib/cms/admin-campaigns";
import { deriveCampaignLifecycle } from "@/lib/cms/campaign-state";

type Filters = { q?: string; status?: string; lifecycle?: string; locale?: string; sort?: string };
export default async function AdminCampaignsPage({ searchParams }: { searchParams: Promise<Filters> }) {
  if (!(await getStaffSession())) redirect("/admin/login"); const filters = await searchParams; let campaigns = await listAdminCampaigns();
  const query = filters.q?.trim().toLowerCase(); if (query) campaigns = campaigns.filter((campaign) => campaign.translations.some((item) => `${item.title} ${item.excerpt}`.toLowerCase().includes(query)));
  if (filters.status) campaigns = campaigns.filter((campaign) => campaign.status === filters.status);
  if (filters.locale) campaigns = campaigns.filter((campaign) => campaign.translations.some((item) => item.locale === filters.locale));
  if (filters.lifecycle) campaigns = campaigns.filter((campaign) => deriveCampaignLifecycle({ startDate: campaign.start_date, endDate: campaign.end_date, lifecycleOverride: campaign.lifecycle_override }) === filters.lifecycle);
  if (filters.sort === "title") campaigns.sort((a, b) => (a.translations[0]?.title ?? "").localeCompare(b.translations[0]?.title ?? "")); else campaigns.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-kicker">Collective action</p><h1>Campaigns</h1><p>{campaigns.length} result{campaigns.length === 1 ? "" : "s"}. Publish reusable fundraising, event, and community initiative pages.</p></div><Link className="admin-primary" href="/admin/campaigns/new">New campaign</Link></header><form className="admin-filters" method="GET"><label className="admin-filter-search"><span>Search campaigns</span><input type="search" name="q" defaultValue={filters.q} placeholder="Title or excerpt" /></label><label><span>Status</span><select name="status" defaultValue={filters.status ?? ""}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label><span>Lifecycle</span><select name="lifecycle" defaultValue={filters.lifecycle ?? ""}><option value="">All lifecycle states</option><option value="active">Active</option><option value="upcoming">Upcoming</option><option value="ended">Ended</option></select></label><label><span>Locale</span><select name="locale" defaultValue={filters.locale ?? ""}><option value="">All locales</option><option value="en">English</option><option value="es">Español</option></select></label><label><span>Sort</span><select name="sort" defaultValue={filters.sort ?? "updated"}><option value="updated">Recently updated</option><option value="title">Title</option></select></label><button className="admin-secondary" type="submit">Apply</button></form><CampaignList campaigns={campaigns} /></div>;
}
