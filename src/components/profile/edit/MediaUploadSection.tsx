
import { useRef, useState } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface MediaUploadSectionProps {
  profileId: string;
  currentAvatarUrl?: string;
  currentBannerUrl?: string;
  onSuccess: () => void;
}

export const MediaUploadSection = ({
  profileId,
  currentAvatarUrl,
  currentBannerUrl,
  onSuccess
}: MediaUploadSectionProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    bucket: string,
    type: 'avatar' | 'banner',
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    console.log(`🎯 Starting ${type} upload via RPC bypass function`);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for avatar, 10MB for banner
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
      }

      // Create filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}/${type}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log(`📞 Updating profile ${type} using RPC bypass function`);

      // Update profile using RPC bypass
      const updateData = type === 'avatar' 
        ? { p_avatar_url: publicUrl }
        : { p_banner_url: publicUrl };

      const { error: updateError } = await supabase.rpc('update_profile_bypass_rls', {
        p_user_id: profileId,
        ...updateData
      });

      if (updateError) {
        console.error(`❌ RPC bypass function error for ${type}:`, updateError);
        throw updateError;
      }

      console.log(`✅ ${type} updated successfully via RPC bypass`);

      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated successfully!`,
      });

      onSuccess();
    } catch (error: any) {
      console.error(`💥 ${type} upload error:`, error);
      toast({
        title: "Upload failed",
        description: error.message || `Failed to upload ${type}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file, 'avatars', 'avatar', setIsUploadingAvatar);
    }
  };

  const handleBannerSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file, 'banners', 'banner', setIsUploadingBanner);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-luxury-neutral flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Profile Picture
        </h3>
        
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-20 h-20 rounded-full overflow-hidden bg-luxury-darker border-2 border-luxury-primary/20 cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-luxury-primary/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-luxury-primary" />
              </div>
            )}
            
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </motion.div>

          <Button
            type="button"
            variant="outline"
            onClick={() => avatarInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
          >
            {isUploadingAvatar ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Change Avatar
              </>
            )}
          </Button>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarSelect}
          className="hidden"
          disabled={isUploadingAvatar}
        />
      </div>

      {/* Banner Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-luxury-neutral flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Banner
        </h3>
        
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative w-full h-32 rounded-xl overflow-hidden bg-luxury-darker border-2 border-luxury-primary/20 cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
          >
            {currentBannerUrl ? (
              <img src={currentBannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-luxury-primary/20 flex items-center justify-center">
                <Camera className="w-12 h-12 text-luxury-primary" />
              </div>
            )}
            
            {isUploadingBanner && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </motion.div>

          <Button
            type="button"
            variant="outline"
            onClick={() => bannerInputRef.current?.click()}
            disabled={isUploadingBanner}
            className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
          >
            {isUploadingBanner ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Change Banner
              </>
            )}
          </Button>
        </div>

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerSelect}
          className="hidden"
          disabled={isUploadingBanner}
        />
      </div>
    </div>
  );
};
