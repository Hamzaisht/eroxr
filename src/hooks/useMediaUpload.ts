
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { MediaAccessLevel, UploadResult } from '@/utils/media/types';

interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  accessLevel?: MediaAccessLevel;
  metadata?: Record<string, any>;
  altText?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
}

export const useMediaUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    isComplete: false
  });
  const { toast } = useToast();

  const uploadMedia = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    const {
      contentCategory = 'general',
      maxSizeInMB = 50,
      accessLevel = MediaAccessLevel.PUBLIC,
      metadata = {},
      altText
    } = options;

    setUploadState({ isUploading: true, progress: 0, isComplete: false });

    try {
      // Check file size
      const maxSize = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File size exceeds ${maxSizeInMB}MB limit`);
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate file path
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const fileName = `${contentCategory}/${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

      setUploadState(prev => ({ ...prev, progress: 25 }));

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadState(prev => ({ ...prev, progress: 75 }));

      // Determine media type
      const getMediaType = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        return 'document';
      };

      // Create media asset record
      const { data: assetData, error: assetError } = await supabase
        .from('media_assets')
        .insert({
          user_id: user.id,
          storage_path: uploadData.path,
          original_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          media_type: getMediaType(file.type),
          access_level: accessLevel,
          alt_text: altText,
          metadata: {
            ...metadata,
            category: contentCategory
          }
        })
        .select()
        .single();

      if (assetError) {
        // Clean up uploaded file if asset creation fails
        await supabase.storage.from('media').remove([uploadData.path]);
        throw assetError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      setUploadState({ isUploading: false, progress: 100, isComplete: true });

      return {
        success: true,
        url: publicUrl,
        assetId: assetData.id
      };
    } catch (error: any) {
      setUploadState({ isUploading: false, progress: 0, isComplete: false });
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });

      return {
        success: false,
        error: error.message || "Upload failed"
      };
    }
  };

  return {
    uploadMedia,
    uploadState
  };
};
