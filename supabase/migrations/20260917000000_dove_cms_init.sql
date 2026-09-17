-- ==============================================================================
-- Dove Youth Development — CMS & Editorial Data Architecture
-- Migration: 20260917000000_dove_cms_init.sql
-- Description: Core tables, enums, triggers, full-text search, and strict RLS.
--              ALL Dove CMS tables are isolated in the `dove` schema so they
--              never collide with the existing MTK Media `public` schema tables.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. CREATE dove SCHEMA
CREATE SCHEMA IF NOT EXISTS dove;

-- Grant usage to Supabase roles
GRANT USAGE ON SCHEMA dove TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dove
  GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA dove
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dove
  GRANT ALL ON SEQUENCES TO service_role;

-- ==============================================================================
-- HELPER TRIGGER FUNCTION (schema-qualified)
-- ==============================================================================

CREATE OR REPLACE FUNCTION dove.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. PROFILES (CMS Staff & Permissions)
--    Auth comes from project-wide auth.users; Dove staff must have an active row
--    here.  An authenticated user with NO active dove.profiles row gets ZERO CMS
--    access, even if they belong to another application on this project.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_dove_profiles_updated_at
  BEFORE UPDATE ON dove.profiles
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

-- Security helpers for RLS — SECURITY DEFINER so they can read dove.profiles
-- even from anon context.  Search_path is pinned to prevent schema injection.
CREATE OR REPLACE FUNCTION dove.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM dove.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
   SET search_path = dove, public, pg_temp;

CREATE OR REPLACE FUNCTION dove.is_editor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM dove.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
   SET search_path = dove, public, pg_temp;

-- ==============================================================================
-- 4. MEDIA ASSETS (Wix Legacy & Cloudinary)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('wix', 'cloudinary')),
  url TEXT NOT NULL,
  public_id TEXT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  bytes BIGINT,
  original_filename TEXT,
  source TEXT, -- 'wix_migration', 'cloudinary_upload', etc.
  source_url TEXT,
  focal_x NUMERIC(4,3) CHECK (focal_x IS NULL OR (focal_x >= 0 AND focal_x <= 1)),
  focal_y NUMERIC(4,3) CHECK (focal_y IS NULL OR (focal_y >= 0 AND focal_y <= 1)),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_dove_media_assets_updated_at
  BEFORE UPDATE ON dove.media_assets
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

-- ==============================================================================
-- 5. STORIES (Canonical Entity)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT, -- Display name attribution (e.g. from legacy Wix author byline)
  cover_media_id UUID REFERENCES dove.media_assets(id) ON DELETE SET NULL,
  featured_home BOOLEAN NOT NULL DEFAULT false,
  featured_stories BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  legacy_wix_id TEXT UNIQUE,
  legacy_wix_url TEXT,
  legacy_wix_slug TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE TRIGGER trg_dove_stories_updated_at
  BEFORE UPDATE ON dove.stories
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

-- ==============================================================================
-- 6. STORY TRANSLATIONS (Isolated EN / ES content)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.story_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES dove.stories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  seo_title TEXT,
  seo_description TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_dove_story_translation_story_locale UNIQUE (story_id, locale),
  CONSTRAINT uq_dove_story_translation_locale_slug UNIQUE (locale, slug)
);

CREATE TRIGGER trg_dove_story_translations_updated_at
  BEFORE UPDATE ON dove.story_translations
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

-- ==============================================================================
-- 7. STORY BLOCKS (Ordered Flexible Content Blocks)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.story_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_translation_id UUID NOT NULL REFERENCES dove.story_translations(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN (
    'heading',
    'rich_text',
    'image',
    'image_text_split',
    'gallery',
    'quote',
    'youtube',
    'callout',
    'button_group',
    'section_intro',
    'divider',
    'spacer'
  )),
  sort_order INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_dove_story_blocks_updated_at
  BEFORE UPDATE ON dove.story_blocks
  FOR EACH ROW EXECUTE FUNCTION dove.set_updated_at();

-- ==============================================================================
-- 8. CATEGORIES & TRANSLATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dove.category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES dove.categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  CONSTRAINT uq_dove_category_translation_category_locale UNIQUE (category_id, locale),
  CONSTRAINT uq_dove_category_translation_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS dove.story_categories (
  story_id UUID NOT NULL REFERENCES dove.stories(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES dove.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, category_id)
);

-- ==============================================================================
-- 9. TAGS & TRANSLATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dove.tag_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID NOT NULL REFERENCES dove.tags(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  CONSTRAINT uq_dove_tag_translation_tag_locale UNIQUE (tag_id, locale),
  CONSTRAINT uq_dove_tag_translation_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS dove.story_tags (
  story_id UUID NOT NULL REFERENCES dove.stories(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES dove.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, tag_id)
);

-- ==============================================================================
-- 10. REDIRECTS (Legacy Wix & Custom Route 301 mappings)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path TEXT NOT NULL UNIQUE,
  destination_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 11. WIX IMPORT MAP (Idempotent Migration Tracking)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.wix_import_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('post', 'category', 'tag', 'media', 'author')),
  wix_id TEXT NOT NULL,
  local_id UUID NOT NULL,
  wix_url TEXT,
  source_checksum TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_dove_wix_import_map_type_wix_id UNIQUE (entity_type, wix_id)
);

-- ==============================================================================
-- 12. AUDIT LOG
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 13. MIGRATION RUNS (Execution & Dry Run Tracking)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS dove.migration_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'wix',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'dry_run')),
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  errors JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- ==============================================================================
-- INDEXES & PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_dove_stories_status_published_at
  ON dove.stories(status, published_at DESC) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_dove_stories_featured_home
  ON dove.stories(featured_home, published_at DESC)
  WHERE featured_home = true AND status = 'published';

CREATE INDEX IF NOT EXISTS idx_dove_stories_featured_stories
  ON dove.stories(featured_stories, published_at DESC)
  WHERE featured_stories = true AND status = 'published';

CREATE INDEX IF NOT EXISTS idx_dove_stories_legacy_wix_id
  ON dove.stories(legacy_wix_id) WHERE legacy_wix_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dove_story_translations_lookup
  ON dove.story_translations(locale, slug, publication_status);

CREATE INDEX IF NOT EXISTS idx_dove_story_translations_story_id
  ON dove.story_translations(story_id);

CREATE INDEX IF NOT EXISTS idx_dove_story_blocks_order
  ON dove.story_blocks(story_translation_id, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_dove_story_blocks_type
  ON dove.story_blocks(block_type);

CREATE INDEX IF NOT EXISTS idx_dove_redirects_source
  ON dove.redirects(source_path) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_dove_wix_import_map_lookup
  ON dove.wix_import_map(entity_type, wix_id);

-- Full text search index (English & Spanish)
CREATE INDEX IF NOT EXISTS idx_dove_story_translations_title_trgm
  ON dove.story_translations USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dove_story_translations_excerpt_trgm
  ON dove.story_translations USING gin (excerpt gin_trgm_ops);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- All policies reference dove.* tables exclusively.
-- Public policies on child tables (story_blocks, story_categories, story_tags,
-- media_assets) validate parent publication state to prevent draft data leakage.
-- ==============================================================================

ALTER TABLE dove.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.story_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.story_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.story_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.tag_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.wix_import_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dove.migration_runs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_users_view_own_profile" ON dove.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "dove_admins_view_all_profiles" ON dove.profiles
  FOR SELECT TO authenticated
  USING (dove.is_admin());

CREATE POLICY "dove_admins_insert_profiles" ON dove.profiles
  FOR INSERT TO authenticated
  WITH CHECK (dove.is_admin());

CREATE POLICY "dove_admins_update_profiles" ON dove.profiles
  FOR UPDATE TO authenticated
  USING (dove.is_admin())
  WITH CHECK (dove.is_admin());

-- ------------------------------------------------------------------------------
-- STORIES POLICIES
-- ------------------------------------------------------------------------------
-- Public can read ONLY published stories where published_at is past/now
CREATE POLICY "dove_public_read_published_stories" ON dove.stories
  FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- Editors & Admins can read all stories
CREATE POLICY "dove_staff_read_all_stories" ON dove.stories
  FOR SELECT TO authenticated
  USING (dove.is_editor());

-- Editors & Admins can create stories
CREATE POLICY "dove_staff_insert_stories" ON dove.stories
  FOR INSERT TO authenticated
  WITH CHECK (dove.is_editor());

-- Editors & Admins can update stories
CREATE POLICY "dove_staff_update_stories" ON dove.stories
  FOR UPDATE TO authenticated
  USING (dove.is_editor())
  WITH CHECK (dove.is_editor());

-- Hard delete restricted to Admins only
CREATE POLICY "dove_admin_delete_stories" ON dove.stories
  FOR DELETE TO authenticated
  USING (dove.is_admin());

-- ------------------------------------------------------------------------------
-- STORY TRANSLATIONS POLICIES
-- Public read checks BOTH translation status AND parent story status.
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_public_read_published_translations" ON dove.story_translations
  FOR SELECT TO anon, authenticated
  USING (
    publication_status = 'published'
    AND EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_translations.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_staff_read_all_translations" ON dove.story_translations
  FOR SELECT TO authenticated
  USING (dove.is_editor());

CREATE POLICY "dove_staff_insert_translations" ON dove.story_translations
  FOR INSERT TO authenticated
  WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_update_translations" ON dove.story_translations
  FOR UPDATE TO authenticated
  USING (dove.is_editor())
  WITH CHECK (dove.is_editor());

CREATE POLICY "dove_admin_delete_translations" ON dove.story_translations
  FOR DELETE TO authenticated
  USING (dove.is_admin());

-- ------------------------------------------------------------------------------
-- STORY BLOCKS POLICIES
-- Public blocks: visible=true AND translation published AND parent story published.
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_public_read_published_story_blocks" ON dove.story_blocks
  FOR SELECT TO anon, authenticated
  USING (
    visible = true
    AND EXISTS (
      SELECT 1 FROM dove.story_translations st
      JOIN dove.stories s ON s.id = st.story_id
      WHERE st.id = story_blocks.story_translation_id
        AND st.publication_status = 'published'
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_staff_read_all_story_blocks" ON dove.story_blocks
  FOR SELECT TO authenticated
  USING (dove.is_editor());

CREATE POLICY "dove_staff_insert_story_blocks" ON dove.story_blocks
  FOR INSERT TO authenticated
  WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_update_story_blocks" ON dove.story_blocks
  FOR UPDATE TO authenticated
  USING (dove.is_editor())
  WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_delete_story_blocks" ON dove.story_blocks
  FOR DELETE TO authenticated
  USING (dove.is_editor());

-- ------------------------------------------------------------------------------
-- MEDIA ASSETS POLICIES
-- Public read: media is accessible only when attached to a published story or
-- visible block of a published story — prevents serving draft media via direct
-- asset ID enumeration.
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_public_read_published_story_media" ON dove.media_assets
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.cover_media_id = media_assets.id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
    OR
    EXISTS (
      SELECT 1 FROM dove.story_blocks sb
      JOIN dove.story_translations st ON st.id = sb.story_translation_id
      JOIN dove.stories s ON s.id = st.story_id
      WHERE sb.visible = true
        AND (sb.data->>'mediaAssetId') = media_assets.id::text
        AND st.publication_status = 'published'
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_staff_read_all_media" ON dove.media_assets
  FOR SELECT TO authenticated
  USING (dove.is_editor());

CREATE POLICY "dove_staff_insert_media" ON dove.media_assets
  FOR INSERT TO authenticated
  WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_update_media" ON dove.media_assets
  FOR UPDATE TO authenticated
  USING (dove.is_editor())
  WITH CHECK (dove.is_editor());

CREATE POLICY "dove_admin_delete_media" ON dove.media_assets
  FOR DELETE TO authenticated
  USING (dove.is_admin());

-- ------------------------------------------------------------------------------
-- CATEGORIES & TAGS POLICIES
-- story_categories / story_tags: public read gated on parent story publication.
-- categories / tags themselves: freely readable (they contain no sensitive data).
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_public_read_published_story_categories" ON dove.story_categories
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_categories.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_public_read_published_story_tags" ON dove.story_tags
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_tags.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_public_read_categories" ON dove.categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "dove_public_read_category_translations" ON dove.category_translations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "dove_public_read_tags" ON dove.tags
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "dove_public_read_tag_translations" ON dove.tag_translations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "dove_staff_manage_categories" ON dove.categories
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_manage_category_translations" ON dove.category_translations
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_manage_story_categories" ON dove.story_categories
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_manage_tags" ON dove.tags
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_manage_tag_translations" ON dove.tag_translations
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_manage_story_tags" ON dove.story_tags
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

-- ------------------------------------------------------------------------------
-- REDIRECTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_public_read_active_redirects" ON dove.redirects
  FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "dove_staff_manage_redirects" ON dove.redirects
  FOR ALL TO authenticated
  USING (dove.is_editor())
  WITH CHECK (dove.is_editor());

-- ------------------------------------------------------------------------------
-- WIX IMPORT MAP, AUDIT LOG & MIGRATION RUNS POLICIES
-- Public: ZERO ACCESS
-- ------------------------------------------------------------------------------
CREATE POLICY "dove_staff_view_wix_import_map" ON dove.wix_import_map
  FOR SELECT TO authenticated USING (dove.is_editor());

CREATE POLICY "dove_staff_insert_wix_import_map" ON dove.wix_import_map
  FOR INSERT TO authenticated WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_update_wix_import_map" ON dove.wix_import_map
  FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_view_audit_log" ON dove.audit_log
  FOR SELECT TO authenticated USING (dove.is_editor());

CREATE POLICY "dove_staff_insert_audit_log" ON dove.audit_log
  FOR INSERT TO authenticated WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_view_migration_runs" ON dove.migration_runs
  FOR SELECT TO authenticated USING (dove.is_editor());

CREATE POLICY "dove_staff_manage_migration_runs" ON dove.migration_runs
  FOR ALL TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
