
import { useState } from 'react';
import { MediaService, UploadResult } from '@/services/mediaService';
import { useToast } from '@/hooks/use-toast';

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    accessLevel: 'private' | 'public' | 'subscribers_only' = 'private'
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await MediaService.uploadFile(file, accessLevel);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully`
        });
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload file",
          variant: "destructive"
        });
      }

      return result;
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });

      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadMultiple = async (
    files: File[],
    accessLevel: 'private' | 'public' | 'subscribers_only' = 'private'
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file, accessLevel);
      results.push(result);
    }

    return results;
  };

  return {
    uploadFile,
    uploadMultiple,
    isUploading,
    uploadProgress
  };
};
