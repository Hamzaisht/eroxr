
import { useState, useCallback } from 'react';
import { useMediaUpload } from './useMediaUpload';
import { useToast } from './use-toast';

export const useContextualMediaUpload = (contextId: string, contextType: string = 'message') => {
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const { uploadMedia } = useMediaUpload();
  const { toast } = useToast();

  // Function to upload a single file
  const uploadSingleFile = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      
      const contentCategory = contextType === 'post' ? 'posts' : 'messages';
      
      const result = await uploadMedia(file, {
        contentCategory,
        maxSizeInMB: 100,
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm',
          'video/quicktime'
        ]
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      // Handle the possibility that url might be undefined
      if (!result.url) {
        throw new Error('Upload succeeded but no URL returned');
      }
      
      return result.url;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload media',
        variant: 'destructive',
      });
      throw error;
    }
  }, [uploadMedia, contextType, toast]);
  
  // Function to handle uploading multiple files
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    if (!files.length) return [];
    
    try {
      setIsUploading(true);
      
      const uploadPromises = Array.from(files).map(file => uploadSingleFile(file));
      const urls = await Promise.all(uploadPromises);
      
      setMediaUrls(prev => [...prev, ...urls]);
      
      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${urls.length} file${urls.length > 1 ? 's' : ''}`,
      });
      
      return urls;
    } catch (error) {
      console.error('Error in batch upload:', error);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [uploadSingleFile, toast]);
  
  // Reset the media urls
  const resetMedia = useCallback(() => {
    setMediaUrls([]);
  }, []);
  
  return {
    isUploading,
    mediaUrls,
    uploadSingleFile,
    uploadFiles,
    resetMedia
  };
};
