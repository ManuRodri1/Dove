import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Dove CMS", template: "%s | Dove CMS" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <main id="main" className="admin-setup"><h1>Dove CMS</h1><p>Supabase environment variables are not configured.</p></main>;
  }

  let shellUser: { displayName: string; email: string; role: "admin" | "editor" } | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name,role,active")
        .eq("id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (profile) shellUser = { displayName: profile.display_name, email: user.email ?? "", role: profile.role };
    }
  } catch {
    shellUser = null;
  }

  if (!shellUser) return <div className="admin-auth-stage"><main id="main">{children}</main></div>;
  return <AdminShell user={shellUser}>{children}</AdminShell>;
}
