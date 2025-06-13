
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageCropDialog } from "../ImageCropDialog";

interface AvatarUploadProps {
  profile: any;
  onSuccess?: () => void;
}

export const useAvatarUpload = ({ profile, onSuccess }: AvatarUploadProps) => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    setTempImageUrl(URL.createObjectURL(file));
    setShowCropDialog(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      console.log('🎯 Starting avatar upload via RPC bypass function');
      
      const file = new File([croppedImageBlob], selectedFile?.name || 'avatar.jpg', {
        type: 'image/jpeg'
      });

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('📞 Updating profile avatar using RPC bypass function');

      // Use the RPC bypass function instead of direct update to avoid RLS recursion
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

      onSuccess?.();

    } catch (error) {
      console.error('💥 Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
      });
    }
  };

  return {
    showCropDialog,
    setShowCropDialog,
    tempImageUrl,
    setTempImageUrl,
    setSelectedFile,
    handleFileSelect,
    handleCropComplete
  };
};
