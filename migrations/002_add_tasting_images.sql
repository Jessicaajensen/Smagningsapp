
ALTER TABLE public.tastings
ADD COLUMN IF NOT EXISTS image_url TEXT;


INSERT INTO storage.buckets (id, name, public)
VALUES ('tasting-images', 'tasting-images', true)
ON CONFLICT (id) DO NOTHING;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can view tasting images'
  ) THEN
    CREATE POLICY "Public can view tasting images"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'tasting-images');
  END IF;
END $$;

-- Allow authenticated users to upload images into their own folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can upload tasting images'
  ) THEN
    CREATE POLICY "Users can upload tasting images"
      ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'tasting-images'
        AND auth.uid()::text = split_part(name, '/', 1)
      );
  END IF;
END $$;