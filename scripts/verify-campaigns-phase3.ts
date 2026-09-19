// @ts-nocheck
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
import { Client } from "pg";
const env = parse(readFileSync(resolve(process.cwd(), ".env.local"))); if (!env.POSTGRES_URL_NON_POOLING) throw new Error("Missing POSTGRES_URL_NON_POOLING");
const connectionString = env.POSTGRES_URL_NON_POOLING.replace(/([?&])sslmode=[^&]+&?/, (_match, lead) => lead === "?" ? "?" : "").replace(/\?$/, "");
const db = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
async function asRole(role: "anon" | "authenticated", sql: string, userId?: string) { await db.query("BEGIN"); try { if (userId) await db.query("SELECT set_config('request.jwt.claim.sub',$1,true)", [userId]); await db.query(`SET LOCAL ROLE ${role}`); const result = await db.query(sql); await db.query("ROLLBACK"); return { allowed: true, rows: result.rows }; } catch (error) { await db.query("ROLLBACK"); return { allowed: false, error: error instanceof Error ? error.message : String(error) }; } }
async function run() {
  await db.connect();
  const counts = await db.query(`SELECT (SELECT count(*) FROM dove.campaigns) campaigns,(SELECT count(*) FROM dove.campaign_translations) translations,(SELECT count(*) FROM dove.campaign_blocks) blocks,(SELECT count(*) FROM dove.campaign_story_links) story_links,(SELECT count(*) FROM dove.campaign_sources) sources`);
  const policies = await db.query("SELECT tablename,policyname,roles,cmd FROM pg_policies WHERE schemaname='dove' AND tablename LIKE 'campaign%' ORDER BY tablename,policyname");
  const grants = await db.query("SELECT table_name,grantee,string_agg(privilege_type,',' ORDER BY privilege_type) privileges FROM information_schema.role_table_grants WHERE table_schema='dove' AND table_name LIKE 'campaign%' GROUP BY table_name,grantee ORDER BY table_name,grantee");
  const run = await db.query("SELECT id,status,stats FROM dove.migration_runs WHERE source='dove_historical_campaigns' ORDER BY started_at DESC LIMIT 1");
  const profiles = await db.query("SELECT id,role FROM dove.profiles WHERE active=true AND role IN ('editor','admin') ORDER BY role");
  const editor = profiles.rows.find((row) => row.role === "editor") ?? profiles.rows.find((row) => row.role === "admin");
  const admin = profiles.rows.find((row) => row.role === "admin");
  const campaign = await db.query("SELECT id FROM dove.campaigns ORDER BY created_at LIMIT 1");
  const anonRead = await asRole("anon", "SELECT count(*)::int public_campaigns FROM dove.campaigns");
  const anonDrafts = await asRole("anon", "SELECT count(*)::int visible_drafts FROM dove.campaigns WHERE status<>'published'");
  const anonHiddenBlocks = await asRole("anon", "SELECT count(*)::int hidden_blocks FROM dove.campaign_blocks WHERE visible=false");
  const anonWrite = await asRole("anon", "INSERT INTO dove.campaigns DEFAULT VALUES RETURNING id");
  const anonSources = await asRole("anon", "SELECT count(*) FROM dove.campaign_sources");
  const noProfileWrite = await asRole("authenticated", "INSERT INTO dove.campaigns DEFAULT VALUES RETURNING id", "00000000-0000-0000-0000-000000000000");
  const editorWrite = editor ? await asRole("authenticated", "INSERT INTO dove.campaigns DEFAULT VALUES RETURNING id", editor.id) : { allowed: false, error: "No active editor/admin profile available" };
  const adminDelete = admin && campaign.rows[0] ? await asRole("authenticated", `DELETE FROM dove.campaigns WHERE id='${campaign.rows[0].id}' RETURNING id`, admin.id) : { allowed: false, error: "No active admin profile available" };
  console.log(JSON.stringify({ counts: counts.rows[0], policies: policies.rows, grants: grants.rows, latestRun: run.rows[0] ?? null, security: { anonRead, anonDrafts, anonHiddenBlocks, anonWriteDenied: !anonWrite.allowed, anonSourcesDenied: !anonSources.allowed, noProfileWriteDenied: !noProfileWrite.allowed, editorWriteAllowed: editorWrite.allowed, adminDeleteAllowed: adminDelete.allowed, principalsUsed: profiles.rows.map((row) => row.role) } }, null, 2));
  await db.end();
}
run().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
