import { useState } from "react";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileBanner } from "@/components/profile/ProfileBanner";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { PreviewModals } from "./PreviewModals";
import { ProfileHeaderStatus } from "./ProfileHeaderStatus";

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
  onCreatePost?: () => void;
  onGoLive?: () => void;
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
  onCreatePost,
  onGoLive,
}: ProfileHeaderContainerProps) => {
  return (
    <div className="relative">
      <ProfileBanner profile={profile} isEditing={isEditing} />
      
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
            <ProfileAvatar profile={profile} isEditing={isEditing} />
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                <ProfileInfo profile={profile} />
                <ProfileHeaderStatus availability={availability} />
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <ProfileStats profile={profile} />
                <div className="lg:ml-auto">
                  <ProfileActions
                    isOwnProfile={isOwnProfile}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleClose}
                    onCreatePost={onCreatePost}
                    onGoLive={onGoLive}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreviewModals
        showAvatarPreview={showAvatarPreview}
        showBannerPreview={showBannerPreview}
        setShowAvatarPreview={setShowAvatarPreview}
        setShowBannerPreview={setShowBannerPreview}
      />
    </div>
  );
};