-- Proposal only: publication workflow for JULSA public content.
-- Existing rows stay published; new rows default to drafts after this migration.
-- Apply only after explicit approval.
BEGIN;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.leaders ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;

ALTER TABLE public.events ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.blog_posts ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.competitions ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.leaders ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.gallery_items ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.news ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.opportunities ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE public.academic_resources ALTER COLUMN is_published SET DEFAULT false;

DROP POLICY IF EXISTS "Public can view events" ON public.events;
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view competitions" ON public.competitions;
DROP POLICY IF EXISTS "Public can view published competitions" ON public.competitions;
CREATE POLICY "Public can view published competitions" ON public.competitions
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view leaders" ON public.leaders;
DROP POLICY IF EXISTS "Public can view published leaders" ON public.leaders;
CREATE POLICY "Public can view published leaders" ON public.leaders
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Public can view published gallery" ON public.gallery_items;
CREATE POLICY "Public can view published gallery" ON public.gallery_items
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view news" ON public.news;
DROP POLICY IF EXISTS "Public can view published news" ON public.news;
CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Public can view published opportunities" ON public.opportunities;
CREATE POLICY "Public can view published opportunities" ON public.opportunities
  FOR SELECT TO public USING (is_published IS TRUE);

DROP POLICY IF EXISTS "Public can view academic resources" ON public.academic_resources;
DROP POLICY IF EXISTS "Public can view published academic resources" ON public.academic_resources;
CREATE POLICY "Public can view published academic resources" ON public.academic_resources
  FOR SELECT TO public USING (is_published IS TRUE);

COMMIT;
