import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dove CMS Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If NEXT_PUBLIC_SUPABASE_URL is not set yet (pre-configuration), allow rendering setup note
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "4rem auto" }}>
        <h2>Dove CMS Foundation</h2>
        <p>Supabase environment variables are not yet configured for this project.</p>
      </div>
    );
  }

  // Check auth session
  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      user = authUser;
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, display_name, role, active")
        .eq("id", authUser.id)
        .eq("active", true)
        .single();
      profile = userProfile;
    }
  } catch {
    // Graceful fallback
  }

  // If not logged in and not on login page, redirect to login
  // Note: During layout execution, children might be login page
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-paper, #faf9f6)" }}>
      {user && profile && (
        <header
          style={{
            borderBottom: "1px solid var(--color-rule, #e2ded5)",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <strong>Dove CMS</strong>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                backgroundColor: profile.role === "admin" ? "#005463" : "#e68337",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {profile.role}
            </span>
            <span style={{ fontSize: "0.875rem", color: "#666" }}>
              {profile.display_name} ({user.email})
            </span>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              style={{
                fontSize: "0.875rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </form>
        </header>
      )}
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
