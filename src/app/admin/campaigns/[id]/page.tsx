import { notFound, redirect } from "next/navigation";
import CampaignEditor from "@/components/admin/campaigns/CampaignEditor";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { getAdminCampaign } from "@/lib/cms/admin-campaigns";
import { listAdminStories, listMediaAssets } from "@/lib/cms/admin-queries";
export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) { if (!(await getStaffSession())) redirect("/admin/login"); const { id } = await params; const [campaign, media, stories] = await Promise.all([getAdminCampaign(id), listMediaAssets(), listAdminStories()]); if (!campaign) notFound(); return <CampaignEditor campaign={campaign} media={media} stories={stories} />; }
