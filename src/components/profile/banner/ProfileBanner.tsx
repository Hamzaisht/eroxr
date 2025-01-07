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
        className="h-[60vh] w-full overflow-hidden relative cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => setShowPreview(true)}
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

        {isOwnProfile && isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-luxury-primary hover:bg-luxury-primary/90 p-3 rounded-full flex items-center justify-center shadow-luxury cursor-pointer z-30 backdrop-blur-sm"
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