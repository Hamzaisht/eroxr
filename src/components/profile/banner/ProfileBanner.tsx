import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Profile } from "@/integrations/supabase/types/profile";
import { BannerMedia } from "./BannerMedia";
import { BannerEditButton } from "./BannerEditButton";
import { BannerPreview } from "./BannerPreview";
import { BannerUploadDialog } from "./BannerUploadDialog";
import { useBannerUpload } from "./useBannerUpload";

interface ProfileBannerProps {
  profile: Profile;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileBanner = ({ profile, getMediaType, isOwnProfile }: ProfileBannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentBannerUrl, setCurrentBannerUrl] = useState<string | null>(null);

  // Update currentBannerUrl when profile changes
  useEffect(() => {
    setCurrentBannerUrl(profile?.banner_url);
  }, [profile?.banner_url]);

  const { isUploading, handleFileChange } = useBannerUpload(profile, (url) => {
    setCurrentBannerUrl(url);
    setShowUploadModal(false);
  });

  const defaultVideoUrl = "https://cdn.pixabay.com/vimeo/505772711/fashion-66214.mp4?width=1280&hash=4adbad56c39a522787b3563a2b65439c2c8b3766";
  const bannerUrl = currentBannerUrl || defaultVideoUrl;
  const bannerMediaType = currentBannerUrl ? getMediaType(currentBannerUrl) : 'video';

  return (
    <>
      <motion.div 
        className="h-[60vh] w-full overflow-hidden relative cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => setShowPreview(true)}
      >
        <BannerMedia 
          mediaUrl={bannerUrl}
          mediaType={bannerMediaType}
          isHovering={isHovering}
        />

        {isOwnProfile && isHovering && (
          <BannerEditButton 
            onClick={(e) => {
              e.stopPropagation();
              setShowUploadModal(true);
            }}
          />
        )}
      </motion.div>

      <BannerUploadDialog
        isOpen={showUploadModal}
        onOpenChange={setShowUploadModal}
        isUploading={isUploading}
        onFileChange={handleFileChange}
      />

      <BannerPreview
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        mediaUrl={bannerUrl}
        mediaType={bannerMediaType}
      />
    </>
  );
};