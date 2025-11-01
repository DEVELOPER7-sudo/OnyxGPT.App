-- Create storage policies for chat-files bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Allow public to read all chat files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'chat-files');

CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);