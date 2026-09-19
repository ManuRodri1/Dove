import { redirect } from "next/navigation";
import TaxonomyManager from "@/components/admin/TaxonomyManager";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { listTaxonomy } from "@/lib/cms/admin-queries";
export default async function AdminTagsPage() { if (!(await getStaffSession())) redirect("/admin/login"); const items = await listTaxonomy("tag"); return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-kicker">Organization</p><h1>Tags</h1><p>Use tags for specific recurring subjects. The public site stays uncluttered while this library is empty.</p></div></header><TaxonomyManager kind="tag" items={items} /></div>; }
