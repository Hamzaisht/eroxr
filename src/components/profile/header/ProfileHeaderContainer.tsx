import { useState } from "react";
import { ProfileBanner } from "@/components/profile/ProfileBanner";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileHeaderStatus } from "./ProfileHeaderStatus";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { PreviewModals } from "./PreviewModals";
import { CreatePostDialog } from "@/components/CreatePostDialog";
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
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleCreatePost = () => {
    setIsPostDialogOpen(true);
    if (onCreatePost) {
      onCreatePost();
    }
  };

  return (
    <div className="relative">
      <ProfileBanner 
        profile={profile}
        getMediaType={getMediaType}
        isOwnProfile={isOwnProfile}
      />
      
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 flex flex-col items-center gap-6 z-20">
          <div className="flex flex-col items-center">
            <ProfileAvatar 
              profile={profile}
              getMediaType={getMediaType}
              isOwnProfile={isOwnProfile}
            />
            
            <div className="mt-4">
              <ProfileHeaderStatus 
                isOwnProfile={isOwnProfile}
                availability={availability}
                setAvailability={setAvailability}
              />
            </div>
          </div>
          
          <div className="w-full max-w-3xl space-y-6 text-center">
            <ProfileInfo profile={profile} />
            
            <div className="flex justify-center">
              <ProfileStats />
            </div>
            
            {isOwnProfile && (
              <div className="flex justify-center gap-4">
                <ProfileActions
                  isOwnProfile={isOwnProfile}
                  isEditing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onSave={handleSave}
                  onCancel={handleClose}
                  onCreatePost={handleCreatePost}
                  onGoLive={onGoLive}
                />
              </div>
            )}
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

      <CreatePostDialog
        open={isPostDialogOpen}
        onOpenChange={setIsPostDialogOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </div>
  );
};

const getMediaType = (url: string): 'video' | 'gif' | 'image' => {
  if (!url) return 'image';
  if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
  if (url.match(/\.gif$/i)) return 'gif';
  return 'image';
};