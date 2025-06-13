
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
      console.log('🎯 Starting avatar upload to avatars bucket:', { fileName: file.name, size: file.size, userId });

      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      }

      // Create unique filename with user ID folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`;

      console.log('📁 Generated filename:', fileName);

      // Upload to avatars bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
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
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('🔗 Generated public URL:', publicUrl);

      // Update profile using direct table update
      console.log('💾 Updating profile avatar_url using direct table update...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      console.log('✅ Profile updated successfully with direct table update');

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
      console.log('🎯 Starting banner upload to banners bucket:', { fileName: file.name, size: file.size, userId });

      // Validate file - support all media types for banner
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('File size must be less than 100MB');
      }

      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/mkv'
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image or video file');
      }

      // Create unique filename with user ID folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/banner_${Date.now()}.${fileExt}`;

      console.log('📁 Generated filename:', fileName);

      // Upload to banners bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
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
        .from('banners')
        .getPublicUrl(fileName);

      console.log('🔗 Generated public URL:', publicUrl);

      // Update profile using direct table update
      console.log('💾 Updating profile banner_url using direct table update...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      console.log('✅ Profile updated successfully with direct table update');

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
