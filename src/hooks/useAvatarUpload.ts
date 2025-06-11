
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File, userId: string): Promise<{ success: boolean; url?: string }> => {
    if (!file || !userId) return { success: false };

    setIsUploading(true);
    
    try {
      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      }

      // Create unique filename with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Update profile with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              avatar_url: publicUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            throw updateError;
          }
          break; // Success, exit retry loop
        } catch (error: any) {
          retries--;
          if (retries === 0) throw error;
          // Wait 500ms before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast({
        title: "Divine Success",
        description: "Your sacred avatar has been blessed and updated!",
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Faltered",
        description: error.message || "Failed to upload avatar. The gods are displeased - try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadBanner = async (file: File, userId: string): Promise<{ success: boolean; url?: string }> => {
    if (!file || !userId) return { success: false };

    setIsUploading(true);
    
    try {
      // Validate file
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for banners (can include videos)
        throw new Error('File size must be less than 50MB');
      }

      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/mov'
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image or video file');
      }

      // Create unique filename with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/banner-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Update profile with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              banner_url: publicUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            throw updateError;
          }
          break; // Success, exit retry loop
        } catch (error: any) {
          retries--;
          if (retries === 0) throw error;
          // Wait 500ms before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast({
        title: "Divine Success",
        description: "Your sacred banner has been blessed and updated!",
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('Banner upload error:', error);
      toast({
        title: "Upload Faltered",
        description: error.message || "Failed to upload banner. The gods are displeased - try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploadBanner,
    isUploading
  };
};
