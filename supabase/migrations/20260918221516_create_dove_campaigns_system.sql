-- Dove Youth Development - production Campaigns CMS. All objects stay in dove.*.

CREATE TABLE dove.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  hero_media_id UUID REFERENCES dove.media_assets(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  lifecycle_override TEXT CHECK (lifecycle_override IS NULL OR lifecycle_override IN ('upcoming','active','ended')),
  location TEXT,
  goal_amount NUMERIC(14,2) CHECK (goal_amount IS NULL OR goal_amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
  raised_amount NUMERIC(14,2) CHECK (raised_amount IS NULL OR raised_amount >= 0),
  raised_amount_is_final BOOLEAN NOT NULL DEFAULT false,
  progress_source TEXT NOT NULL DEFAULT 'none' CHECK (progress_source IN ('none','manual','external','embed','api')),
  progress_updated_at TIMESTAMPTZ,
  external_provider TEXT CHECK (external_provider IS NULL OR external_provider IN ('network_for_good','bonterra','other')),
  external_campaign_id TEXT,
  donation_url TEXT CHECK (donation_url IS NULL OR donation_url ~ '^https://'),
  featured_home BOOLEAN NOT NULL DEFAULT false,
  featured_campaigns BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_dove_campaign_date_order CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date),
  CONSTRAINT ck_dove_campaign_progress_source CHECK (raised_amount IS NULL OR progress_source <> 'none')
);
CREATE TRIGGER trg_dove_campaigns_updated_at BEFORE UPDATE ON dove.campaigns
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

CREATE TABLE dove.campaign_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES dove.campaigns(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en','es')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  eyebrow TEXT,
  headline TEXT,
  excerpt TEXT NOT NULL DEFAULT '',
  seo_title TEXT,
  seo_description TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft','published','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_dove_campaign_translation_campaign_locale UNIQUE (campaign_id, locale),
  CONSTRAINT uq_dove_campaign_translation_locale_slug UNIQUE (locale, slug)
);
CREATE TRIGGER trg_dove_campaign_translations_updated_at BEFORE UPDATE ON dove.campaign_translations
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

CREATE TABLE dove.campaign_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_translation_id UUID NOT NULL REFERENCES dove.campaign_translations(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('heading','rich_text','image','image_text_split','gallery','quote','youtube','callout','button_group','section_intro','divider','spacer','campaign_stats','participation_options')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_dove_campaign_blocks_updated_at BEFORE UPDATE ON dove.campaign_blocks
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

CREATE TABLE dove.campaign_story_links (
  campaign_id UUID NOT NULL REFERENCES dove.campaigns(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES dove.stories(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'related' CHECK (relationship_type IN ('announcement','update','result','related')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (campaign_id, story_id)
);

CREATE TABLE dove.campaign_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES dove.campaigns(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('wix_page','wix_post','network_for_good','manual','other')),
  source_id TEXT,
  source_url TEXT,
  source_title TEXT,
  source_checksum TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_verified_at TIMESTAMPTZ,
  CONSTRAINT ck_dove_campaign_source_identity CHECK (source_id IS NOT NULL OR source_url IS NOT NULL)
);

CREATE INDEX idx_dove_campaigns_publication ON dove.campaigns(status,published_at DESC) WHERE status='published';
CREATE INDEX idx_dove_campaigns_dates ON dove.campaigns(end_date DESC NULLS LAST,start_date DESC NULLS LAST,published_at DESC,created_at DESC);
CREATE INDEX idx_dove_campaigns_featured_home ON dove.campaigns(featured_home,published_at DESC) WHERE featured_home=true AND status='published';
CREATE INDEX idx_dove_campaigns_featured_campaigns ON dove.campaigns(featured_campaigns,published_at DESC) WHERE featured_campaigns=true AND status='published';
CREATE INDEX idx_dove_campaigns_hero_media_id ON dove.campaigns(hero_media_id);
CREATE INDEX idx_dove_campaigns_created_by ON dove.campaigns(created_by);
CREATE INDEX idx_dove_campaigns_updated_by ON dove.campaigns(updated_by);
CREATE INDEX idx_dove_campaign_translations_lookup ON dove.campaign_translations(locale,slug,publication_status);
CREATE INDEX idx_dove_campaign_translations_campaign_id ON dove.campaign_translations(campaign_id);
CREATE INDEX idx_dove_campaign_translations_title_trgm ON dove.campaign_translations USING gin (title gin_trgm_ops);
CREATE INDEX idx_dove_campaign_blocks_order ON dove.campaign_blocks(campaign_translation_id,sort_order);
CREATE INDEX idx_dove_campaign_story_links_story_id ON dove.campaign_story_links(story_id);
CREATE INDEX idx_dove_campaign_story_links_order ON dove.campaign_story_links(campaign_id,sort_order);
CREATE INDEX idx_dove_campaign_sources_campaign_id ON dove.campaign_sources(campaign_id);
CREATE UNIQUE INDEX uq_dove_campaign_sources_type_id ON dove.campaign_sources(source_type,source_id) WHERE source_id IS NOT NULL;
CREATE UNIQUE INDEX uq_dove_campaign_sources_type_url ON dove.campaign_sources(source_type,source_url) WHERE source_url IS NOT NULL;

ALTER TABLE dove.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.campaign_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.campaign_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.campaign_story_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.campaign_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY dove_anon_read_published_campaigns ON dove.campaigns FOR SELECT TO anon
  USING (status='published' AND published_at IS NOT NULL AND published_at<=now() AND (scheduled_at IS NULL OR scheduled_at<=now()));
CREATE POLICY dove_authenticated_read_campaigns ON dove.campaigns FOR SELECT TO authenticated
  USING ((status='published' AND published_at IS NOT NULL AND published_at<=now() AND (scheduled_at IS NULL OR scheduled_at<=now())) OR dove.is_editor());
CREATE POLICY dove_staff_insert_campaigns ON dove.campaigns FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_update_campaigns ON dove.campaigns FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY dove_admin_delete_campaigns ON dove.campaigns FOR DELETE TO authenticated USING (dove.is_admin());

CREATE POLICY dove_anon_read_published_campaign_translations ON dove.campaign_translations FOR SELECT TO anon
  USING (publication_status='published' AND EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.id=campaign_id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())));
CREATE POLICY dove_authenticated_read_campaign_translations ON dove.campaign_translations FOR SELECT TO authenticated
  USING ((publication_status='published' AND EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.id=campaign_id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))) OR dove.is_editor());
CREATE POLICY dove_staff_insert_campaign_translations ON dove.campaign_translations FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_update_campaign_translations ON dove.campaign_translations FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_delete_campaign_translations ON dove.campaign_translations FOR DELETE TO authenticated USING (dove.is_editor());

CREATE POLICY dove_anon_read_published_campaign_blocks ON dove.campaign_blocks FOR SELECT TO anon
  USING (visible=true AND EXISTS (SELECT 1 FROM dove.campaign_translations ct JOIN dove.campaigns c ON c.id=ct.campaign_id WHERE ct.id=campaign_translation_id AND ct.publication_status='published' AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())));
CREATE POLICY dove_authenticated_read_campaign_blocks ON dove.campaign_blocks FOR SELECT TO authenticated
  USING ((visible=true AND EXISTS (SELECT 1 FROM dove.campaign_translations ct JOIN dove.campaigns c ON c.id=ct.campaign_id WHERE ct.id=campaign_translation_id AND ct.publication_status='published' AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))) OR dove.is_editor());
CREATE POLICY dove_staff_insert_campaign_blocks ON dove.campaign_blocks FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_update_campaign_blocks ON dove.campaign_blocks FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_delete_campaign_blocks ON dove.campaign_blocks FOR DELETE TO authenticated USING (dove.is_editor());

CREATE POLICY dove_anon_read_published_campaign_story_links ON dove.campaign_story_links FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.id=campaign_id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())) AND EXISTS (SELECT 1 FROM dove.stories s WHERE s.id=story_id AND s.status='published' AND s.published_at IS NOT NULL AND s.published_at<=now()));
CREATE POLICY dove_authenticated_read_campaign_story_links ON dove.campaign_story_links FOR SELECT TO authenticated
  USING ((EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.id=campaign_id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())) AND EXISTS (SELECT 1 FROM dove.stories s WHERE s.id=story_id AND s.status='published' AND s.published_at IS NOT NULL AND s.published_at<=now())) OR dove.is_editor());
CREATE POLICY dove_staff_insert_campaign_story_links ON dove.campaign_story_links FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_update_campaign_story_links ON dove.campaign_story_links FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_delete_campaign_story_links ON dove.campaign_story_links FOR DELETE TO authenticated USING (dove.is_editor());

CREATE POLICY dove_staff_read_campaign_sources ON dove.campaign_sources FOR SELECT TO authenticated USING (dove.is_editor());
CREATE POLICY dove_staff_insert_campaign_sources ON dove.campaign_sources FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY dove_staff_update_campaign_sources ON dove.campaign_sources FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY dove_admin_delete_campaign_sources ON dove.campaign_sources FOR DELETE TO authenticated USING (dove.is_admin());

-- Public media remains row-scoped: these policies expose only assets attached
-- to a published Campaign or a visible block in a published translation.
CREATE POLICY dove_anon_read_published_campaign_media ON dove.media_assets FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.hero_media_id=media_assets.id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())) OR
  EXISTS (SELECT 1 FROM dove.campaign_blocks cb JOIN dove.campaign_translations ct ON ct.id=cb.campaign_translation_id JOIN dove.campaigns c ON c.id=ct.campaign_id WHERE cb.visible=true AND (cb.data->>'mediaAssetId')=media_assets.id::text AND ct.publication_status='published' AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))
);
CREATE POLICY dove_authenticated_read_published_campaign_media ON dove.media_assets FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.hero_media_id=media_assets.id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())) OR
  EXISTS (SELECT 1 FROM dove.campaign_blocks cb JOIN dove.campaign_translations ct ON ct.id=cb.campaign_translation_id JOIN dove.campaigns c ON c.id=ct.campaign_id WHERE cb.visible=true AND (cb.data->>'mediaAssetId')=media_assets.id::text AND ct.publication_status='published' AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now())) OR dove.is_editor()
);

-- Explicit least-privilege grants are required independently of RLS.
REVOKE ALL ON TABLE dove.campaigns,dove.campaign_translations,dove.campaign_blocks,dove.campaign_story_links,dove.campaign_sources FROM anon,authenticated;
GRANT SELECT ON TABLE dove.campaigns,dove.campaign_translations,dove.campaign_blocks,dove.campaign_story_links TO anon;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE dove.campaigns,dove.campaign_translations,dove.campaign_blocks,dove.campaign_story_links,dove.campaign_sources TO authenticated;
GRANT ALL ON TABLE dove.campaigns,dove.campaign_translations,dove.campaign_blocks,dove.campaign_story_links,dove.campaign_sources TO service_role;
