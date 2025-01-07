import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileStats } from "./ProfileStats";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfileEditModal } from "./ProfileEditModal";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="relative" ref={containerRef}>
        <motion.div style={{ opacity, scale }}>
          <ProfileBanner profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
          <ProfileStats />
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-32 pb-4 z-30">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative"
            >
              <div className="relative group">
                <ProfileAvatar profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
              </div>

              <div className="mt-6 flex justify-between items-start">
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
      </div>

      {isEditing && isOwnProfile && (
        <ProfileEditModal onSave={handleSave} />
      )}
    </>
  );
};