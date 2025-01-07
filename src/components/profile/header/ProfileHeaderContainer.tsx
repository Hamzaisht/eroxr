import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileBanner } from "@/components/profile/ProfileBanner";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { PreviewModals } from "./PreviewModals";
import { ProfileHeaderStatus } from "./ProfileHeaderStatus";
import type { Profile } from "@/integrations/supabase/types/profile";
import type { AvailabilityStatus } from "@/components/ui/availability-indicator";

interface ProfileHeaderContainerProps {
  profile: Profile;
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

const getMediaType = (url: string): 'video' | 'gif' | 'image' => {
  if (!url) return 'image';
  if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
  if (url.match(/\.gif$/i)) return 'gif';
  return 'image';
};

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
      <ProfileBanner 
        profile={profile} 
        getMediaType={getMediaType}
        isOwnProfile={isOwnProfile}
      />
      
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 mb-8 flex flex-col lg:flex-row items-start lg:items-end gap-6 z-20">
          <div className="flex-shrink-0">
            <ProfileAvatar 
              profile={profile}
              getMediaType={getMediaType}
              isOwnProfile={isOwnProfile}
            />
          </div>
          
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <ProfileInfo profile={profile} />
              <div className="lg:ml-4">
                <ProfileHeaderStatus 
                  isOwnProfile={isOwnProfile}
                  availability={availability}
                  setAvailability={setAvailability}
                />
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <ProfileStats />
              </div>
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

      <PreviewModals
        profile={profile}
        getMediaType={getMediaType}
        showAvatarPreview={showAvatarPreview}
        showBannerPreview={showBannerPreview}
        setShowAvatarPreview={setShowAvatarPreview}
        setShowBannerPreview={setShowBannerPreview}
      />
    </div>
  );
};