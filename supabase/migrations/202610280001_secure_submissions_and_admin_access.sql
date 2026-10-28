-- JULSA: protect private submissions and make public form retries idempotent.
-- Existing rows are retained. Run only after reviewing and approving this migration.
BEGIN;

ALTER TABLE public.members ADD COLUMN IF NOT EXISTS idempotency_key uuid;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS idempotency_key uuid;
CREATE UNIQUE INDEX IF NOT EXISTS members_idempotency_key_key
  ON public.members (idempotency_key);
CREATE UNIQUE INDEX IF NOT EXISTS contact_messages_idempotency_key_key
  ON public.contact_messages (idempotency_key);

CREATE TABLE IF NOT EXISTS public.julsa_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.julsa_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.julsa_admins FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_julsa_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.julsa_admins
    WHERE user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.is_julsa_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_julsa_admin() TO authenticated;
REVOKE ALL ON public.julsa_admins FROM PUBLIC, anon, authenticated;

-- Public clients can submit only. Admin reads and changes are restricted by RLS.
REVOKE ALL ON public.members, public.contact_messages FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.members, public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members, public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "Admins manage members" ON public.members;
CREATE POLICY "Admins manage members" ON public.members
  FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins manage contact messages" ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());

-- Content tables remain publicly readable under their existing SELECT policies.
-- Writes are available only to explicitly provisioned administrators.
REVOKE ALL ON public.events, public.blog_posts, public.competitions,
  public.leaders, public.gallery_items, public.news, public.opportunities,
  public.academic_resources FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.events, public.blog_posts, public.competitions,
  public.leaders, public.gallery_items, public.news, public.opportunities,
  public.academic_resources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events, public.blog_posts,
  public.competitions, public.leaders, public.gallery_items, public.news,
  public.opportunities, public.academic_resources TO authenticated;

DROP POLICY IF EXISTS "Admins manage events" ON public.events;
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins manage blog posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage competitions" ON public.competitions;
CREATE POLICY "Admins manage competitions" ON public.competitions FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage leaders" ON public.leaders;
CREATE POLICY "Admins manage leaders" ON public.leaders FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins manage gallery items" ON public.gallery_items FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage news" ON public.news;
CREATE POLICY "Admins manage news" ON public.news FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage opportunities" ON public.opportunities;
CREATE POLICY "Admins manage opportunities" ON public.opportunities FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage academic resources" ON public.academic_resources;
CREATE POLICY "Admins manage academic resources" ON public.academic_resources FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());

-- Admins can review event and competition applications; anonymous users only insert.
REVOKE ALL ON public.event_registrations, public.competition_registrations FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.event_registrations, public.competition_registrations TO anon;
GRANT SELECT, UPDATE, DELETE ON public.event_registrations, public.competition_registrations TO authenticated;
DROP POLICY IF EXISTS "Admins manage event registrations" ON public.event_registrations;
CREATE POLICY "Admins manage event registrations" ON public.event_registrations FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());
DROP POLICY IF EXISTS "Admins manage competition registrations" ON public.competition_registrations;
CREATE POLICY "Admins manage competition registrations" ON public.competition_registrations FOR ALL TO authenticated
  USING (public.is_julsa_admin()) WITH CHECK (public.is_julsa_admin());

COMMIT;
