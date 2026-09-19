import { redirect } from "next/navigation";
import TaxonomyManager from "@/components/admin/TaxonomyManager";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { listTaxonomy } from "@/lib/cms/admin-queries";
export default async function AdminCategoriesPage() { if (!(await getStaffSession())) redirect("/admin/login"); const items = await listTaxonomy("category"); return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-kicker">Organization</p><h1>Categories</h1><p>Maintain broad editorial groupings in English and Spanish. Empty categories are never fabricated.</p></div></header><TaxonomyManager kind="category" items={items} /></div>; }
