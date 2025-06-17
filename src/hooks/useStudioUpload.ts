
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UploadProgress } from '@/components/studio/types';

export const useStudioUpload = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const { toast } = useToast();

  const uploadMedia = async (
    file: File, 
    userId: string, 
    type: 'avatar' | 'banner'
  ): Promise<{ success: boolean; url?: string }> => {
    console.log(`🎨 Studio: Starting ${type} upload`, { fileName: file.name, size: file.size });
    
    setProgress({ progress: 0, status: 'uploading', message: 'Preparing upload...' });

    try {
      // Validate file size (10MB for avatars, 50MB for banners)
      const maxSize = type === 'avatar' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      }

      // Validate file type
      const allowedTypes = type === 'avatar' 
        ? ['image/jpeg', 'image/png', 'image/webp']
        : ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please select a supported format.');
      }

      setProgress({ progress: 20, status: 'uploading', message: 'Uploading file...' });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;
      const bucket = type === 'avatar' ? 'studio-avatars' : 'studio-banners';

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { 
          cacheControl: '3600',
          upsert: false 
        });

      if (uploadError) {
        console.error('❌ Studio: Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setProgress({ progress: 70, status: 'uploading', message: 'Processing...' });

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProgress({ progress: 90, status: 'uploading', message: 'Updating profile...' });

      // Update profile
      const updateData = type === 'avatar' 
        ? { p_avatar_url: publicUrl }
        : { p_banner_url: publicUrl };

      const { error: updateError } = await supabase.rpc('studio_update_profile', updateData);

      if (updateError) {
        console.error('❌ Studio: Profile update error:', updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      setProgress({ progress: 100, status: 'success', message: 'Upload complete!' });

      toast({
        title: "Upload Successful",
        description: `Your ${type} has been updated successfully!`,
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('💥 Studio: Upload error:', error);
      setProgress({ progress: 0, status: 'error', message: error.message });
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media",
        variant: "destructive",
      });

      return { success: false };
    }
  };

  return {
    uploadMedia,
    progress,
    resetProgress: () => setProgress({ progress: 0, status: 'idle' })
  };
};
