-- Consolidate Story and Campaign media visibility so each role/action has one
-- permissive policy. This resolves the advisor warning without broadening rows.
DROP POLICY IF EXISTS dove_anon_read_published_story_media ON dove.media_assets;
DROP POLICY IF EXISTS dove_anon_read_published_campaign_media ON dove.media_assets;
DROP POLICY IF EXISTS dove_authenticated_read_media ON dove.media_assets;
DROP POLICY IF EXISTS dove_authenticated_read_published_campaign_media ON dove.media_assets;

CREATE POLICY dove_anon_read_published_content_media ON dove.media_assets
  FOR SELECT TO anon USING (
    EXISTS (SELECT 1 FROM dove.stories s WHERE s.cover_media_id=media_assets.id AND s.status='published' AND s.published_at IS NOT NULL AND s.published_at<=now())
    OR EXISTS (SELECT 1 FROM dove.story_blocks sb JOIN dove.story_translations st ON st.id=sb.story_translation_id JOIN dove.stories s ON s.id=st.story_id WHERE sb.visible=true AND (sb.data->>'mediaAssetId')=media_assets.id::text AND st.publication_status='published' AND s.status='published' AND s.published_at IS NOT NULL AND s.published_at<=now())
    OR EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.hero_media_id=media_assets.id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))
    OR EXISTS (SELECT 1 FROM dove.campaign_blocks cb JOIN dove.campaign_translations ct ON ct.id=cb.campaign_translation_id JOIN dove.campaigns c ON c.id=ct.campaign_id WHERE cb.visible=true AND (cb.data->>'mediaAssetId')=media_assets.id::text AND ct.publication_status='published' AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))
  );

CREATE POLICY dove_authenticated_read_content_media ON dove.media_assets
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM dove.stories s WHERE s.cover_media_id=media_assets.id AND s.status='published' AND s.published_at IS NOT NULL AND s.published_at<=now())
    OR EXISTS (SELECT 1 FROM dove.story_blocks sb JOIN dove.story_translations st ON st.id=sb.story_translation_id JOIN dove.stories s ON s.id=st.story_id WHERE sb.visible=true AND (sb.data->>'mediaAssetId')=media_assets.id::text AND st.publication_status='published' AND s.status='published' AND s.published_at IS NOT NULL AND s.published_at<=now())
    OR EXISTS (SELECT 1 FROM dove.campaigns c WHERE c.hero_media_id=media_assets.id AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))
    OR EXISTS (SELECT 1 FROM dove.campaign_blocks cb JOIN dove.campaign_translations ct ON ct.id=cb.campaign_translation_id JOIN dove.campaigns c ON c.id=ct.campaign_id WHERE cb.visible=true AND (cb.data->>'mediaAssetId')=media_assets.id::text AND ct.publication_status='published' AND c.status='published' AND c.published_at IS NOT NULL AND c.published_at<=now() AND (c.scheduled_at IS NULL OR c.scheduled_at<=now()))
    OR dove.is_editor()
  );
