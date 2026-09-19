import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { listMediaAssets } from "@/lib/cms/admin-queries";
import MediaLibrary from "@/components/admin/media/MediaLibrary";

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!(await getStaffSession())) redirect("/admin/login");
  const { q = "" } = await searchParams;
  const assets = await listMediaAssets(q);
  return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-kicker">Asset library</p><h1>Media</h1><p>Browse the existing Dove archive or upload a new image to the protected Cloudinary namespace.</p></div></header><MediaLibrary assets={assets} query={q} /></div>;
}
