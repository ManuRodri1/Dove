-- ==============================================================================
-- Dove Youth Development — CMS & Editorial Data Architecture
-- Migration: 20260917000001_harden_dove_cms_security_and_indexes.sql
-- Description: Security search_path fix, RLS auth.uid optimization, missing
--              foreign key indexes, and RLS policy consolidation.
-- ==============================================================================

-- 1. FIX FUNCTION SEARCH_PATH
-- Lock search_path for dove.set_updated_at to resolve function_search_path_mutable warning.
CREATE OR REPLACE FUNCTION dove.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SET search_path = dove, pg_temp;

-- Optimize helper functions with (SELECT auth.uid()) for query planner
CREATE OR REPLACE FUNCTION dove.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM dove.profiles
    WHERE id = (SELECT auth.uid())
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
    WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'editor')
      AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
   SET search_path = dove, public, pg_temp;


-- 2. ADD MISSING FOREIGN KEY INDEXES
CREATE INDEX IF NOT EXISTS idx_dove_audit_log_user_id ON dove.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_dove_media_assets_created_by ON dove.media_assets(created_by);
CREATE INDEX IF NOT EXISTS idx_dove_stories_author_id ON dove.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_dove_stories_cover_media_id ON dove.stories(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_dove_stories_created_by ON dove.stories(created_by);
CREATE INDEX IF NOT EXISTS idx_dove_stories_updated_by ON dove.stories(updated_by);
CREATE INDEX IF NOT EXISTS idx_dove_story_categories_category_id ON dove.story_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_dove_story_tags_tag_id ON dove.story_tags(tag_id);


-- 3. RLS POLICY OPTIMIZATION & PERMISSIVE POLICY CONSOLIDATION
-- PROFILES POLICIES
DROP POLICY IF EXISTS "dove_users_view_own_profile" ON dove.profiles;
DROP POLICY IF EXISTS "dove_admins_view_all_profiles" ON dove.profiles;

CREATE POLICY "dove_authenticated_read_profiles" ON dove.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR dove.is_admin());

-- STORIES POLICIES
DROP POLICY IF EXISTS "dove_public_read_published_stories" ON dove.stories;
DROP POLICY IF EXISTS "dove_staff_read_all_stories" ON dove.stories;

CREATE POLICY "dove_anon_read_published_stories" ON dove.stories
  FOR SELECT TO anon
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY "dove_authenticated_read_stories" ON dove.stories
  FOR SELECT TO authenticated
  USING (
    (status = 'published' AND published_at IS NOT NULL AND published_at <= now())
    OR dove.is_editor()
  );

-- STORY TRANSLATIONS POLICIES
DROP POLICY IF EXISTS "dove_public_read_published_translations" ON dove.story_translations;
DROP POLICY IF EXISTS "dove_staff_read_all_translations" ON dove.story_translations;

CREATE POLICY "dove_anon_read_published_translations" ON dove.story_translations
  FOR SELECT TO anon
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

CREATE POLICY "dove_authenticated_read_translations" ON dove.story_translations
  FOR SELECT TO authenticated
  USING (
    (
      publication_status = 'published'
      AND EXISTS (
        SELECT 1 FROM dove.stories s
        WHERE s.id = story_translations.story_id
          AND s.status = 'published'
          AND s.published_at IS NOT NULL
          AND s.published_at <= now()
      )
    )
    OR dove.is_editor()
  );

-- STORY BLOCKS POLICIES
DROP POLICY IF EXISTS "dove_public_read_published_story_blocks" ON dove.story_blocks;
DROP POLICY IF EXISTS "dove_staff_read_all_story_blocks" ON dove.story_blocks;

CREATE POLICY "dove_anon_read_published_story_blocks" ON dove.story_blocks
  FOR SELECT TO anon
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

CREATE POLICY "dove_authenticated_read_story_blocks" ON dove.story_blocks
  FOR SELECT TO authenticated
  USING (
    (
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
    )
    OR dove.is_editor()
  );

-- MEDIA ASSETS POLICIES
DROP POLICY IF EXISTS "dove_public_read_published_story_media" ON dove.media_assets;
DROP POLICY IF EXISTS "dove_staff_read_all_media" ON dove.media_assets;

CREATE POLICY "dove_anon_read_published_story_media" ON dove.media_assets
  FOR SELECT TO anon
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

CREATE POLICY "dove_authenticated_read_media" ON dove.media_assets
  FOR SELECT TO authenticated
  USING (
    (
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
    )
    OR dove.is_editor()
  );

-- STORY CATEGORIES & STORY TAGS POLICIES
DROP POLICY IF EXISTS "dove_public_read_published_story_categories" ON dove.story_categories;
DROP POLICY IF EXISTS "dove_staff_manage_story_categories" ON dove.story_categories;

CREATE POLICY "dove_anon_read_published_story_categories" ON dove.story_categories
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_categories.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_authenticated_read_story_categories" ON dove.story_categories
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_categories.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
    OR dove.is_editor()
  );

CREATE POLICY "dove_staff_insert_story_categories" ON dove.story_categories
  FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_story_categories" ON dove.story_categories
  FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_story_categories" ON dove.story_categories
  FOR DELETE TO authenticated USING (dove.is_editor());


DROP POLICY IF EXISTS "dove_public_read_published_story_tags" ON dove.story_tags;
DROP POLICY IF EXISTS "dove_staff_manage_story_tags" ON dove.story_tags;

CREATE POLICY "dove_anon_read_published_story_tags" ON dove.story_tags
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_tags.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
  );

CREATE POLICY "dove_authenticated_read_story_tags" ON dove.story_tags
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dove.stories s
      WHERE s.id = story_tags.story_id
        AND s.status = 'published'
        AND s.published_at IS NOT NULL
        AND s.published_at <= now()
    )
    OR dove.is_editor()
  );

CREATE POLICY "dove_staff_insert_story_tags" ON dove.story_tags
  FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_story_tags" ON dove.story_tags
  FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_story_tags" ON dove.story_tags
  FOR DELETE TO authenticated USING (dove.is_editor());


-- CATEGORIES, CATEGORY TRANSLATIONS, TAGS, TAG TRANSLATIONS POLICIES
DROP POLICY IF EXISTS "dove_staff_manage_categories" ON dove.categories;
CREATE POLICY "dove_staff_insert_categories" ON dove.categories FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_categories" ON dove.categories FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_categories" ON dove.categories FOR DELETE TO authenticated USING (dove.is_editor());

DROP POLICY IF EXISTS "dove_staff_manage_category_translations" ON dove.category_translations;
CREATE POLICY "dove_staff_insert_category_translations" ON dove.category_translations FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_category_translations" ON dove.category_translations FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_category_translations" ON dove.category_translations FOR DELETE TO authenticated USING (dove.is_editor());

DROP POLICY IF EXISTS "dove_staff_manage_tags" ON dove.tags;
CREATE POLICY "dove_staff_insert_tags" ON dove.tags FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_tags" ON dove.tags FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_tags" ON dove.tags FOR DELETE TO authenticated USING (dove.is_editor());

DROP POLICY IF EXISTS "dove_staff_manage_tag_translations" ON dove.tag_translations;
CREATE POLICY "dove_staff_insert_tag_translations" ON dove.tag_translations FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_tag_translations" ON dove.tag_translations FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_tag_translations" ON dove.tag_translations FOR DELETE TO authenticated USING (dove.is_editor());


-- REDIRECTS POLICIES
DROP POLICY IF EXISTS "dove_public_read_active_redirects" ON dove.redirects;
DROP POLICY IF EXISTS "dove_staff_manage_redirects" ON dove.redirects;

CREATE POLICY "dove_anon_read_active_redirects" ON dove.redirects
  FOR SELECT TO anon USING (active = true);

CREATE POLICY "dove_authenticated_read_redirects" ON dove.redirects
  FOR SELECT TO authenticated USING (active = true OR dove.is_editor());

CREATE POLICY "dove_staff_insert_redirects" ON dove.redirects
  FOR INSERT TO authenticated WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_update_redirects" ON dove.redirects
  FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());

CREATE POLICY "dove_staff_delete_redirects" ON dove.redirects
  FOR DELETE TO authenticated USING (dove.is_editor());


-- MIGRATION RUNS POLICIES
DROP POLICY IF EXISTS "dove_staff_view_migration_runs" ON dove.migration_runs;
DROP POLICY IF EXISTS "dove_staff_manage_migration_runs" ON dove.migration_runs;

CREATE POLICY "dove_staff_select_migration_runs" ON dove.migration_runs
  FOR SELECT TO authenticated USING (dove.is_editor());
CREATE POLICY "dove_staff_insert_migration_runs" ON dove.migration_runs
  FOR INSERT TO authenticated WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_update_migration_runs" ON dove.migration_runs
  FOR UPDATE TO authenticated USING (dove.is_editor()) WITH CHECK (dove.is_editor());
CREATE POLICY "dove_staff_delete_migration_runs" ON dove.migration_runs
  FOR DELETE TO authenticated USING (dove.is_editor());
