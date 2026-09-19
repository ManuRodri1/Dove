-- Dove CMS client-role privileges, intentionally narrower than the RLS policy
-- surface. RLS remains the row-level authority for every granted operation.
-- This migration does not alter policies, tables, functions, data, public.*, or
-- service_role privileges.

-- Both Data API client roles need schema lookup, but neither may create objects.
GRANT USAGE ON SCHEMA dove TO anon, authenticated;
REVOKE CREATE ON SCHEMA dove FROM anon, authenticated;

-- Signed-out visitors only need the public publishing surface. The initial
-- schema migration granted SELECT on every Dove table; remove even the
-- table-level path to sensitive/system records that have no anonymous use.
REVOKE SELECT ON TABLE
  dove.profiles,
  dove.wix_import_map,
  dove.audit_log,
  dove.migration_runs
FROM anon;

-- Assert that anonymous Data API requests cannot mutate any Dove table.
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA dove FROM anon;

-- Phase 2 content authoring. Existing RLS policies limit INSERT/UPDATE to
-- active editors/admins, and hard DELETE to the role encoded by each policy.
GRANT INSERT, UPDATE, DELETE ON TABLE
  dove.stories,
  dove.story_translations,
  dove.story_blocks,
  dove.media_assets,
  dove.categories,
  dove.category_translations,
  dove.story_categories,
  dove.tags,
  dove.tag_translations,
  dove.story_tags
TO authenticated;

-- Profile provisioning and role changes remain admin-only through the existing
-- dove.is_admin() INSERT/UPDATE policies. There is no profile DELETE grant.
GRANT INSERT, UPDATE ON TABLE dove.profiles TO authenticated;
REVOKE DELETE ON TABLE dove.profiles FROM authenticated;

-- CMS actions append audit events and staff may read them. Audit history is
-- immutable to Data API users.
GRANT INSERT ON TABLE dove.audit_log TO authenticated;
REVOKE UPDATE, DELETE ON TABLE dove.audit_log FROM authenticated;

-- Redirect editing is not part of Phase 2. Import provenance and migration runs
-- are system-owned. Preserve their existing authenticated read paths only.
REVOKE INSERT, UPDATE, DELETE ON TABLE
  dove.redirects,
  dove.wix_import_map,
  dove.migration_runs
FROM authenticated;

-- All Dove primary keys use gen_random_uuid(); the schema owns no sequences, so
-- no sequence privilege is required or granted.
