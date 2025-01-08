import { ProfileHeaderContainer } from "./header/ProfileHeaderContainer";
import type { ProfileHeaderProps } from "./types";

export const ProfileHeader = ({ 
  profile, 
  isOwnProfile,
  isEditing = false,
  setIsEditing = () => {}
}: ProfileHeaderProps) => {
  return (
    <ProfileHeaderContainer
      profile={profile}
      isOwnProfile={isOwnProfile}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      availability="offline"
      showAvatarPreview={false}
      showBannerPreview={false}
      setShowAvatarPreview={() => {}}
      setShowBannerPreview={() => {}}
      setAvailability={() => {}}
      handleSave={() => {}}
      handleClose={() => {}}
      onGoLive={() => {}}
    />
  );
};