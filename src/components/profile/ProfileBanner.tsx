import { motion } from "framer-motion";
import { useState } from "react";
import { Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileBannerProps {
  profile: Profile;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileBanner = ({ profile, getMediaType, isOwnProfile }: ProfileBannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const bannerMediaType = getMediaType(profile?.banner_url || '');

  const handleBannerClick = () => {
    if (isOwnProfile && !isUploading) {
      document.getElementById('banner-upload')?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/banner.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

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

  return (
    <motion.div 
      className="h-[60vh] w-full overflow-hidden relative cursor-pointer group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={handleBannerClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to opacity-90 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.1)_0%,transparent_70%)] animate-pulse z-20" />
      
      {bannerMediaType === 'video' ? (
        <video
          src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
          className={`w-full h-full object-cover transform transition-transform duration-700 ${
            isHovering ? 'scale-105' : 'scale-100'
          }`}
          autoPlay={isHovering}
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
          alt="Profile Banner"
          className={`w-full h-full object-cover transform transition-transform duration-700 ${
            isHovering ? 'scale-105' : 'scale-100'
          }`}
        />
      )}

      {isOwnProfile && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="bg-luxury-darker/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-white"
          >
            <Image className="w-5 h-5" />
            <span className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Edit Banner"}
            </span>
          </motion.div>
        </div>
      )}

      <input
        type="file"
        id="banner-upload"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </motion.div>
  );
};