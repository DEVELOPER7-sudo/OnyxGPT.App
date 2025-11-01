import { useState } from 'react';
import { toast } from 'sonner';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  puterPath: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    setIsUploading(true);
    try {
      // @ts-ignore - Puter is loaded via script tag
      const puter = window.puter;
      
      if (!puter) {
        throw new Error('Puter is not available');
      }

      // Upload file to Puter
      const uploadedFile = await puter.fs.upload(file);
      
      // Get a shareable URL for the file
      const url = await puter.fs.getURL(uploadedFile);
      
      const uploadedFileData: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        puterPath: uploadedFile,
      };

      setUploadedFiles(prev => [...prev, uploadedFileData]);
      toast.success(`${file.name} uploaded successfully`);
      
      return uploadedFileData;
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
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

  const removeFile = (puterPath: string) => {
    setUploadedFiles(prev => prev.filter(f => f.puterPath !== puterPath));
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
