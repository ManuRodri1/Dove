import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  async function handleLogin(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      redirect("/admin/login?error=Email%20and%20password%20are%20required");
    }

    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
      }
    } catch (err) {
      // If redirect was thrown, rethrow it for Next.js navigation
      if ((err as Error).message?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      redirect("/admin/login?error=Authentication%20failed");
    }

    redirect("/admin");
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "6rem auto",
        padding: "2.5rem",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid var(--color-rule, #e2ded5)",
      }}
    >
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", color: "#005463", margin: "0 0 0.5rem" }}>
          Dove CMS Login
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>
          Authorized staff and editorial access only.
        </p>
      </div>

      {params.error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
          role="alert"
        >
          {params.error}
        </div>
      )}

      {params.message && (
        <div
          style={{
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          {params.message}
        </div>
      )}

      <form action={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.4rem" }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.4rem" }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#005463",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
