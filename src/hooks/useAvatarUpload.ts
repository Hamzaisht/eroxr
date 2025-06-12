
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
      console.log('🎯 Starting avatar upload:', { fileName: file.name, size: file.size, userId });

      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      }

      // Create unique filename with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      console.log('📁 Generated filename:', fileName);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      console.log('🔗 Generated public URL:', publicUrl);

      // Update profile with direct approach to avoid RLS conflicts
      console.log('💾 Updating profile avatar_url...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      console.log('✅ Profile updated successfully');

      toast({
        title: "Divine Success",
        description: "Your sacred avatar has been blessed and updated!",
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('💥 Avatar upload error:', error);
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
      console.log('🎯 Starting banner upload:', { fileName: file.name, size: file.size, userId });

      // Validate file
      if (file.size > 50 * 1024 * 1024) {
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

      console.log('📁 Generated filename:', fileName);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      console.log('🔗 Generated public URL:', publicUrl);

      // Update profile with direct approach to avoid RLS conflicts
      console.log('💾 Updating profile banner_url...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          banner_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      console.log('✅ Profile updated successfully');

      toast({
        title: "Divine Success",
        description: "Your sacred banner has been blessed and updated!",
      });

      return { success: true, url: publicUrl };

    } catch (error: any) {
      console.error('💥 Banner upload error:', error);
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
