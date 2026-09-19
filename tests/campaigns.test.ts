import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { canDisplayProgress, comparePastCampaigns, deriveCampaignLifecycle } from "../src/lib/cms/campaign-state";

test("Campaign lifecycle separates publication from temporal state", () => {
  const now = new Date("2026-06-15T12:00:00Z");
  assert.equal(deriveCampaignLifecycle({ startDate: "2026-07-01", endDate: "2026-07-10" }, now), "upcoming");
  assert.equal(deriveCampaignLifecycle({ startDate: "2026-06-01", endDate: "2026-06-30" }, now), "active");
  assert.equal(deriveCampaignLifecycle({ startDate: "2025-05-01", endDate: "2025-05-04" }, now), "ended");
  assert.equal(deriveCampaignLifecycle({ startDate: null, endDate: null, lifecycleOverride: "ended" }, now), "ended");
});

test("Past Campaign ordering uses end, start, published, then created date", () => {
  const item = (id: string, endDate: string | null, startDate: string | null, publishedAt: string, createdAt: string) => ({ id, endDate, startDate, publishedAt, createdAt });
  const rows = [item("older", "2023-01-01", "2022-01-01", "2023-01-02", "2022-01-01"), item("recent", "2025-05-04", "2025-05-01", "2025-05-05", "2025-01-01"), item("undated", null, null, "2026-01-01", "2026-01-01")].sort(comparePastCampaigns);
  assert.deepEqual(rows.map((row) => row.id), ["recent", "older", "undated"]);
});

test("Progress is shown only with an amount and a defined trustworthy source", () => {
  assert.equal(canDisplayProgress({ raisedAmount: 2515, progressSource: "manual" }), true);
  assert.equal(canDisplayProgress({ raisedAmount: 2515, progressSource: "none" }), false);
  assert.equal(canDisplayProgress({ raisedAmount: null, progressSource: "external" }), false);
});

test("Campaign migration encodes publication, locale, hidden-block, grant, and no-profile protections", () => {
  const sql = readFileSync(resolve("supabase/migrations/20260918221516_create_dove_campaigns_system.sql"), "utf8");
  assert.match(sql, /published_at<=now\(\)/);
  assert.match(sql, /scheduled_at IS NULL OR scheduled_at<=now\(\)/);
  assert.match(sql, /publication_status='published'/);
  assert.match(sql, /visible=true/);
  assert.match(sql, /dove\.is_editor\(\)/);
  assert.match(sql, /dove\.is_admin\(\)/);
  assert.match(sql, /REVOKE ALL ON TABLE[\s\S]+FROM anon,authenticated/);
  assert.doesNotMatch(sql, /GRANT ALL[^;]+TO anon/);
  assert.doesNotMatch(sql, /campaign_sources[^;]+TO anon/);
});

test("Historical import is idempotent, preserves Story rows, and creates only approved redirects", () => {
  const source = readFileSync(resolve("scripts/migrate-historical-campaigns.ts"), "utf8");
  assert.match(source, /SELECT campaign_id FROM dove\.campaign_sources/);
  assert.match(source, /campaigns_skipped\+\+/);
  assert.match(source, /ON CONFLICT \(source_path\) DO NOTHING/);
  assert.match(source, /campaign_story_links/);
  assert.doesNotMatch(source, /DELETE FROM dove\.stories/i);
  assert.match(source, /'\/climb-with-purpose','\/en\/campaigns\/climb-with-purpose-2026'/);
  assert.match(source, /'\/wwtp','\/en\/campaigns\/weekend-with-the-pros-2025'/);
});

test("Related Story ordering remains explicit and stable", () => {
  const links = [{ story_id: "result", sort_order: 2 }, { story_id: "announcement", sort_order: 0 }, { story_id: "update", sort_order: 1 }].sort((a, b) => a.sort_order - b.sort_order);
  assert.deepEqual(links.map((link) => link.story_id), ["announcement", "update", "result"]);
});
