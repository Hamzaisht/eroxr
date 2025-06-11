
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
      // Create unique filename
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
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
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

      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar. Please try again.",
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
      // Create unique filename
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
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Update profile with new banner URL
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

      toast({
        title: "Success",
        description: "Banner updated successfully!",
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('Banner upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload banner. Please try again.",
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
