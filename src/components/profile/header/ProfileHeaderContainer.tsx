import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProfileBanner } from "../banner/ProfileBanner";
import { ProfileStats } from "../ProfileStats";
import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileInfo } from "../ProfileInfo";
import { ProfileActions } from "../ProfileActions";
import { ProfileEditModal } from "../ProfileEditModal";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { PreviewModals } from "./PreviewModals";

interface ProfileHeaderContainerProps {
  profile: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  availability: AvailabilityStatus;
  showAvatarPreview: boolean;
  showBannerPreview: boolean;
  setShowAvatarPreview: (show: boolean) => void;
  setShowBannerPreview: (show: boolean) => void;
  setAvailability: (status: AvailabilityStatus) => void;
  handleSave: () => void;
  handleClose: () => void;
  setIsEditing: (editing: boolean) => void;
}

export const ProfileHeaderContainer = ({
  profile,
  isOwnProfile,
  isEditing,
  availability,
  showAvatarPreview,
  showBannerPreview,
  setShowAvatarPreview,
  setShowBannerPreview,
  setAvailability,
  handleSave,
  handleClose,
  setIsEditing,
}: ProfileHeaderContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  const getMediaType = (url: string) => {
    if (!url) return 'image';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'webm'].includes(extension || '')) return 'video';
    if (extension === 'gif') return 'gif';
    return 'image';
  };

  return (
    <>
      <div className="relative" ref={containerRef}>
        <motion.div style={{ opacity, scale }}>
          <div 
            onClick={() => profile?.banner_url && setShowBannerPreview(true)}
            className="cursor-pointer"
          >
            <ProfileBanner profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
          </div>
          <ProfileStats />
        </motion.div>

        <div className="-mt-32 pb-4 z-30">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative px-4"
          >
            <div className="relative group">
              <div onClick={() => profile?.avatar_url && setShowAvatarPreview(true)} className="cursor-pointer">
                <ProfileAvatar 
                  profile={profile} 
                  getMediaType={getMediaType} 
                  isOwnProfile={isOwnProfile} 
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-start">
              <ProfileInfo profile={profile} />
              <ProfileActions 
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <PreviewModals 
        profile={profile}
        showAvatarPreview={showAvatarPreview}
        showBannerPreview={showBannerPreview}
        setShowAvatarPreview={setShowAvatarPreview}
        setShowBannerPreview={setShowBannerPreview}
        getMediaType={getMediaType}
      />

      {isEditing && isOwnProfile && (
        <ProfileEditModal 
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </>
  );
};