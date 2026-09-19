"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deriveCampaignLifecycle } from "@/lib/cms/campaign-state";
import { setCampaignStatusAction } from "@/app/admin/campaigns/actions";
import type { AdminCampaign } from "@/lib/cms/admin-campaigns";

export default function CampaignList({ campaigns }: { campaigns: AdminCampaign[] }) {
  const router = useRouter(); const [busy, setBusy] = useState<string | null>(null);
  const change = async (id: string, status: "draft" | "published" | "archived") => { setBusy(id); await setCampaignStatusAction(id, status); setBusy(null); router.refresh(); };
  return <div className="admin-list"><div className="admin-list-head campaign-admin-grid"><span>Campaign</span><span>Languages</span><span>Status / lifecycle</span><span>Dates / goal</span><span>Updated</span><span>Actions</span></div>{campaigns.map((campaign) => { const title = campaign.translations.find((item) => item.locale === "en")?.title ?? campaign.translations[0]?.title ?? "Untitled campaign"; const slug = campaign.translations.find((item) => item.locale === "en")?.slug; const lifecycle = deriveCampaignLifecycle({ startDate: campaign.start_date, endDate: campaign.end_date, lifecycleOverride: campaign.lifecycle_override }); return <article className="admin-list-row campaign-admin-grid" key={campaign.id}><div className="admin-list-title">{campaign.hero_media && <span className="admin-list-thumb"><Image src={(Array.isArray(campaign.hero_media) ? campaign.hero_media[0] : campaign.hero_media).url} alt="" fill sizes="64px" /></span>}<span><strong>{title}</strong><small>{campaign.location || "No location"}</small></span></div><div className="admin-locale-badges">{campaign.translations.map((item) => <span key={item.locale} data-status={item.publication_status}>{item.locale.toUpperCase()}</span>)}</div><div><span className="admin-status" data-status={campaign.status}>{campaign.status}</span><small>{lifecycle}</small></div><div><span>{campaign.start_date || "—"} → {campaign.end_date || "—"}</span><small>{campaign.goal_amount === null ? "No monetary goal" : `${campaign.currency} ${campaign.goal_amount}`}</small></div><time dateTime={campaign.updated_at}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(campaign.updated_at))}</time><div className="admin-row-actions"><Link href={`/admin/campaigns/${campaign.id}`}>Edit</Link>{slug && <Link href={`/en/campaigns/${slug}`} target="_blank">Preview</Link>}{campaign.status !== "published" && <button disabled={busy === campaign.id} onClick={() => change(campaign.id, "published")}>Publish</button>}{campaign.status !== "archived" && <button disabled={busy === campaign.id} onClick={() => change(campaign.id, "archived")}>Archive</button>}</div></article>; })}</div>;
}
