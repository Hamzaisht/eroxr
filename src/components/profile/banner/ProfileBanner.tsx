import { motion } from "framer-motion";
import { useState } from "react";
import { PencilIcon } from "lucide-react";
import type { Profile } from "@/integrations/supabase/types/profile";
import { BannerUploadModal } from "./BannerUploadModal";
import { BannerPreviewModal } from "./BannerPreviewModal";
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
  const { isUploading, handleFileChange } = useBannerUpload(profile);
  const bannerMediaType = getMediaType(profile?.banner_url || '');

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
        {bannerMediaType === 'video' ? (
          <video
            src={profile?.banner_url || "https://cdn.pixabay.com/vimeo/505772711/fashion-66214.mp4?width=1280&hash=4adbad56c39a522787b3563a2b65439c2c8b3766"}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}

        {isOwnProfile && isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-luxury-primary hover:bg-luxury-primary/90 p-3 rounded-full flex items-center justify-center cursor-pointer z-30"
            onClick={(e) => {
              e.stopPropagation();
              setShowUploadModal(true);
            }}
          >
            <PencilIcon className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </motion.div>

      <BannerUploadModal
        isOpen={showUploadModal}
        onOpenChange={setShowUploadModal}
        isUploading={isUploading}
        onFileChange={handleFileChange}
      />

      <BannerPreviewModal
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        mediaUrl={profile?.banner_url}
        mediaType={bannerMediaType}
      />
    </>
  );
};