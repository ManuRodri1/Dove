import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.active) {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>Your account is not registered as an active staff member in the Dove CMS.</p>
        <p>Contact an administrator for access.</p>
      </div>
    );
  }

  // Query counts for overview
  const { count: storiesCount } = await supabase
    .from("stories")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("stories")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: wixImportsCount } = await supabase
    .from("wix_import_map")
    .select("*", { count: "exact", head: true });

  const { count: mediaCount } = await supabase
    .from("media_assets")
    .select("*", { count: "exact", head: true });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", color: "#005463", margin: "0 0 0.5rem" }}>
          Welcome, {profile.display_name}
        </h1>
        <p style={{ color: "#666", margin: 0 }}>
          Dove CMS Backend Foundation — Phase 1 Verification Dashboard
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-rule, #e2ded5)",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
            Total Stories
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#005463" }}>
            {storiesCount ?? 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-rule, #e2ded5)",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
            Published Stories
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#005463" }}>
            {publishedCount ?? 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-rule, #e2ded5)",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
            Media Assets
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#005463" }}>
            {mediaCount ?? 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--color-rule, #e2ded5)",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
            Migrated from Wix
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e68337" }}>
            {wixImportsCount ?? 0}
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid var(--color-rule, #e2ded5)",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem", color: "#005463" }}>
          Phase 1 Architecture Status
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#444" }}>
          <li>
            <strong>Authentication:</strong> Active via Supabase Auth. Session validated server-side.
          </li>
          <li>
            <strong>Authorization / RBAC:</strong> Profile role verified as{" "}
            <code>{profile.role}</code>.
          </li>
          <li>
            <strong>Data Layer:</strong> Structured content block schemas, multilingual EN/ES
            isolation, and strict RLS policies enabled.
          </li>
          <li>
            <strong>Visual CMS Editor:</strong> Scheduled for Backend Phase 2 after backend
            foundations and Wix migration dry run are verified.
          </li>
        </ul>
      </div>
    </div>
  );
}
