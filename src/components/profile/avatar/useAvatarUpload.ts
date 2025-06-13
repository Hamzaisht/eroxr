
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAvatarUpload = (profile: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or GIF file",
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('🎯 Starting avatar upload via RPC bypass function');
      
      // Create a unique filename with timestamp and user ID
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/${timestamp}.${fileExt}`;
      
      // Upload to Supabase Storage with correct content type
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('📞 Updating profile avatar using RPC bypass function');

      // Use the bypass RPC function instead of direct update to avoid RLS recursion
      const { error: updateError } = await supabase.rpc('update_profile_bypass_rls', {
        p_user_id: profile.id,
        p_avatar_url: publicUrl
      });

      if (updateError) {
        console.error('❌ RPC bypass function error:', updateError);
        throw updateError;
      }

      console.log('✅ Avatar updated successfully via RPC bypass');

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      // Force a page reload to show the new avatar
      window.location.reload();

    } catch (error) {
      console.error('💥 Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handleFileChange,
  };
};
