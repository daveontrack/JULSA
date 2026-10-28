-- JULSA public media uploads: public reads for published assets, admin-only writes.
-- This migration creates one bucket and scoped storage policies; it does not
-- modify or delete existing buckets or objects.
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE id = 'julsa-public-files'
      AND (
        public IS DISTINCT FROM true
        OR file_size_limit IS DISTINCT FROM 10485760::bigint
        OR allowed_mime_types IS DISTINCT FROM ARRAY[
          'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'
        ]::text[]
      )
  ) THEN
    RAISE EXCEPTION 'Bucket julsa-public-files already exists with different settings; review it before applying this migration.';
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'julsa-public-files',
  'julsa-public-files',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "JULSA admins upload own public assets" ON storage.objects;
CREATE POLICY "JULSA admins upload own public assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'julsa-public-files'
  AND public.is_julsa_admin()
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

DROP POLICY IF EXISTS "JULSA admins update own public assets" ON storage.objects;
CREATE POLICY "JULSA admins update own public assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'julsa-public-files'
  AND public.is_julsa_admin()
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'julsa-public-files'
  AND public.is_julsa_admin()
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

DROP POLICY IF EXISTS "JULSA admins delete own public assets" ON storage.objects;
CREATE POLICY "JULSA admins delete own public assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'julsa-public-files'
  AND public.is_julsa_admin()
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

COMMIT;
