import { parse } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/supabase/database.types";

type Counts = {
  stories: number;
  translations: number;
  blocks: number;
  media: number;
  redirects: number;
};

const env = parse(readFileSync(resolve(process.cwd(), ".env.local")));
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  throw new Error("Missing Supabase URL, anon key, or service-role key in .env.local");
}

const anon = createClient<Database, "dove">(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: "dove" },
});
const admin = createClient<Database, "dove">(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: "dove" },
});

async function exactCount(table: keyof Counts): Promise<number> {
  const tableName = table === "translations" ? "story_translations" : table === "blocks" ? "story_blocks" : table === "media" ? "media_assets" : table;
  const { count, error } = await admin.from(tableName).select("*", { count: "exact", head: true });
  if (error) throw new Error(`${tableName}: ${error.message}`);
  return count ?? 0;
}

async function run() {
  const countKeys: Array<keyof Counts> = ["stories", "translations", "blocks", "media", "redirects"];
  const countEntries = await Promise.all(countKeys.map(async (key) => [key, await exactCount(key)] as const));
  const counts = Object.fromEntries(countEntries) as Counts;

  const { data: published, error: publishedError } = await anon
    .from("stories")
    .select("id,published_at,translations:story_translations!inner(id,locale,slug,title,publication_status)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .eq("translations.locale", "en")
    .eq("translations.publication_status", "published")
    .order("published_at", { ascending: false });

  const { data: translations, error: translationsError } = await anon
    .from("story_translations")
    .select("id,story_id,locale,slug,title,publication_status,story:stories!inner(id,status,published_at)")
    .eq("locale", "en")
    .eq("publication_status", "published")
    .eq("story.status", "published")
    .lte("story.published_at", new Date().toISOString());

  console.log(JSON.stringify({
    counts,
    storiesQuery: { rows: published?.length ?? 0, error: publishedError?.message ?? null },
    translationsQuery: { rows: translations?.length ?? 0, error: translationsError?.message ?? null },
  }, null, 2));
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
