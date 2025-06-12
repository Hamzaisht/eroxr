
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profile";

export const useBannerUpload = (profile: Profile, onSuccess: (url: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log('🎯 Starting banner upload via RPC bypass function');
      
      // First, delete the existing banner if it exists
      if (profile.banner_url) {
        const oldFilePath = profile.banner_url.split('/').pop();
        if (oldFilePath) {
          const { error: deleteError } = await supabase.storage
            .from('banners')
            .remove([oldFilePath]);

          if (deleteError) {
            console.error('Error deleting old banner:', deleteError);
          }
        }
      }
      
      // Upload new banner
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/banner.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      console.log('📞 Updating profile banner using RPC bypass function');
      
      // Use the bypass RPC function instead of direct update
      const { error: updateError } = await supabase.rpc('update_profile_bypass_rls', {
        p_user_id: profile.id,
        p_banner_url: publicUrl
      });

      if (updateError) {
        console.error('❌ RPC bypass function error:', updateError);
        throw updateError;
      }

      console.log('✅ Banner updated successfully via RPC bypass');
      onSuccess(publicUrl);
      
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

    } catch (error) {
      console.error('💥 Banner upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banner. Please try again.",
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
