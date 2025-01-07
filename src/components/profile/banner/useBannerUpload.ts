import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profile";

export const useBannerUpload = (profile: Profile, onSuccess: (url: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
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
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      onSuccess(publicUrl);
      
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banner. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 20MB",
      });
      return;
    }

    await handleUpload(file);
  };

  return {
    isUploading,
    handleFileChange,
  };
};