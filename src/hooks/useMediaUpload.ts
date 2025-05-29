
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadMediaToSupabase, uploadMultipleMedia, UploadResult } from '@/utils/upload/supabaseUpload';

export interface MediaUploadOptions {
  contentCategory?: string;
  accessLevel?: 'private' | 'public' | 'subscribers_only';
  metadata?: Record<string, any>;
}

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadMedia = async (
    file: File,
    options: MediaUploadOptions = {}
  ): Promise<UploadResult> => {
    console.log("🎯 useMediaUpload - Starting single file upload");
    
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadMediaToSupabase(file, {
        category: options.contentCategory,
        accessLevel: options.accessLevel,
        metadata: options.metadata
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!result.success) {
        setError(result.error || 'Upload failed');
        toast({
          title: "Upload Failed",
          description: result.error || 'Failed to upload file',
          variant: "destructive"
        });
      } else {
        toast({
          title: "Upload Complete",
          description: "File uploaded successfully"
        });
      }

      return result;

    } catch (error: any) {
      console.error("💥 useMediaUpload error:", error);
      setError(error.message);
      toast({
        title: "Upload Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive"
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultiple = async (
    files: File[],
    options: MediaUploadOptions = {}
  ): Promise<UploadResult[]> => {
    console.log("🎯 useMediaUpload - Starting multiple file upload");
    
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const results = await uploadMultipleMedia(files, {
        category: options.contentCategory,
        accessLevel: options.accessLevel,
        metadata: options.metadata
      });

      setProgress(100);

      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      if (failCount > 0) {
        setError(`${failCount} of ${results.length} uploads failed`);
        toast({
          title: "Partial Upload Success",
          description: `${successCount} files uploaded, ${failCount} failed`,
          variant: failCount === results.length ? "destructive" : "default"
        });
      } else {
        toast({
          title: "All Uploads Complete",
          description: `Successfully uploaded ${successCount} files`
        });
      }

      return results;

    } catch (error: any) {
      console.error("💥 useMediaUpload batch error:", error);
      setError(error.message);
      toast({
        title: "Batch Upload Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive"
      });
      
      return files.map(() => ({ success: false, error: error.message }));
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  };

  // Create uploadState object for backward compatibility
  const uploadState = {
    isUploading,
    progress,
    error,
    isComplete: !isUploading && progress === 100 && !error
  };

  return {
    uploadMedia,
    uploadMultiple,
    isUploading,
    progress,
    error,
    uploadState,
    reset
  };
};
