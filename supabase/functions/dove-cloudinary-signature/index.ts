import { withSupabase } from "npm:@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const folderMap = {
  uploads: "uploads",
  stories: "stories",
  campaigns: "campaigns",
} as const;

async function sha1(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default {
  fetch: withSupabase({ auth: "user" }, async (request, context) => {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

    const userId = context.userClaims?.sub;
    if (!userId) return json({ error: "Authentication required." }, 401);

    const { data: profile, error: profileError } = await context.supabase
      .schema("dove")
      .from("profiles")
      .select("role, active")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || !profile?.active || !["admin", "editor"].includes(profile.role)) {
      return json({ error: "You are not allowed to upload media." }, 403);
    }

    const body = await request.json().catch(() => ({}));
    const requestedFolder = typeof body.folder === "string" ? body.folder : "uploads";
    const folderName = folderMap[requestedFolder as keyof typeof folderMap];
    if (!folderName) return json({ error: "Invalid upload folder." }, 400);

    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");
    if (!cloudName || !apiKey || !apiSecret) return json({ error: "Cloudinary secrets are not configured in Supabase." }, 500);

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `dove-youth-development/${folderName}`;
    const signature = await sha1(`folder=${folder}&timestamp=${timestamp}${apiSecret}`);

    return json({ apiKey, cloudName, folder, signature, timestamp });
  }),
};
