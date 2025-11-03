import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { optimizeImageFile } from '@/lib/image-optimizer';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  storagePath: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (inputFile: File): Promise<UploadedFile | null> => {
    setIsUploading(true);
    
    // Validate file size (50MB max)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (inputFile.size > MAX_SIZE) {
      toast.error(`File too large: ${inputFile.name} (max 50MB)`);
      setIsUploading(false);
      return null;
    }
    
    // Validate file type (support mobile HEIC/HEIF and unknown mimetypes)
    const ALLOWED_DOC_TYPES = [
      'text/plain', 'application/json', 'application/xml', 'text/xml', 'application/pdf'
    ];
    const isImageByType = inputFile.type?.startsWith('image/');
    const isImageByExt = /\.(png|jpe?g|gif|webp|heic|heif)$/i.test(inputFile.name || '');
    const hasNoExt = !/\.[^./]+$/.test(inputFile.name || '');
    const isUnknownType = inputFile.type === '' || inputFile.type === 'application/octet-stream';
    const isUnknownButLikelyImage = isUnknownType && (isImageByExt || hasNoExt);
    const isAllowed = isImageByType || isImageByExt || isUnknownButLikelyImage || ALLOWED_DOC_TYPES.includes(inputFile.type);
    if (!isAllowed) {
      toast.error(`File type not allowed: ${inputFile.name}`);
      setIsUploading(false);
      return null;
    }
    
    try {
      // Optimize images client-side for faster upload + vision processing
      const file = (isImageByType || isImageByExt || isUnknownButLikelyImage)
        ? await optimizeImageFile(inputFile)
        : inputFile;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to upload files');
      }

      // Create unique file path with user ID and timestamp
      const timestamp = Date.now();
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${user.id}/${timestamp}-${file.name}`;

      // Determine a reliable content type (mobile/PWA often omits it)
      const extToMime: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
        heic: 'image/heic', heif: 'image/heif', pdf: 'application/pdf', txt: 'text/plain', json: 'application/json', xml: 'application/xml'
      };
      const resolvedContentType = file.type || (ext ? extToMime[ext] : undefined) || 'application/octet-stream';

      // Upload file to Lovable Cloud Storage
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: resolvedContentType
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get signed URL with 30 min expiry (private bucket)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('chat-files')
        .createSignedUrl(fileName, 1800);

      if (signedUrlError || !signedUrlData) {
        throw new Error('Failed to generate file URL');
      }
      
      const uploadedFileData: UploadedFile = {
        name: inputFile.name, // show original name to users
        size: file.size,
        type: resolvedContentType,
        url: signedUrlData.signedUrl,
        storagePath: fileName,
      };

      setUploadedFiles(prev => [...prev, uploadedFileData]);
      toast.success(`${inputFile.name} uploaded successfully`);
      
      return uploadedFileData;
    } catch (error: any) {
      // Only log detailed errors in development
      if (import.meta.env.DEV) {
        console.error('File upload error:', error);
      }
      const msg = (error?.message || error?.error || '').toString();
      toast.error(`Failed to upload ${inputFile.name}${msg ? `: ${msg}` : ''}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleFiles = async (files: File[]): Promise<UploadedFile[]> => {
    const results = await Promise.all(files.map(uploadFile));
    return results.filter((f): f is UploadedFile => f !== null);
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  const removeFile = async (storagePath: string) => {
    try {
      // Delete from Lovable Cloud Storage
      const { error } = await supabase.storage
        .from('chat-files')
        .remove([storagePath]);

      if (error) {
        // Only log in development
        if (import.meta.env.DEV) {
          console.error('Error deleting file:', error);
        }
        toast.error('Failed to delete file');
      }

      setUploadedFiles(prev => prev.filter(f => f.storagePath !== storagePath));
    } catch (error) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Error removing file:', error);
      }
      toast.error('Failed to remove file');
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadedFiles,
    clearFiles,
    removeFile,
  };
};
