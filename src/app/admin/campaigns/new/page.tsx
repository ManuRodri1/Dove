import { redirect } from "next/navigation";
import CampaignEditor from "@/components/admin/campaigns/CampaignEditor";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { listAdminStories, listMediaAssets } from "@/lib/cms/admin-queries";
export default async function NewCampaignPage() { if (!(await getStaffSession())) redirect("/admin/login"); const [media, stories] = await Promise.all([listMediaAssets(), listAdminStories()]); return <CampaignEditor campaign={null} media={media} stories={stories} />; }
