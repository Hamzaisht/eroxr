import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profile";

export const useBannerUpload = (profile: Profile) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
      });
      return;
    }

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (img.width < 1500 || img.height < 500) {
            toast({
              variant: "destructive",
              title: "Image too small",
              description: "Banner image should be at least 1500x500 pixels",
            });
            resolve(false);
          }
          resolve(true);
        };
      });
    }

    try {
      setIsUploading(true);
      
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

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

      window.location.reload();

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

  return {
    isUploading,
    handleFileChange,
  };
};