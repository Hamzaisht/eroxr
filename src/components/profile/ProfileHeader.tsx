import { useState } from "react";
import { ProfileHeaderContainer } from "./header/ProfileHeaderContainer";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import type { Profile } from "@/integrations/supabase/types";

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  onGoLive?: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onGoLive }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [showBannerPreview, setShowBannerPreview] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  return (
    <>
      <ProfileHeaderContainer
        profile={profile}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        availability={availability}
        showAvatarPreview={showAvatarPreview}
        showBannerPreview={showBannerPreview}
        setShowAvatarPreview={setShowAvatarPreview}
        setShowBannerPreview={setShowBannerPreview}
        setAvailability={setAvailability}
        handleSave={() => setIsEditing(false)}
        handleClose={() => setIsEditing(false)}
        setIsEditing={setIsEditing}
        onGoLive={onGoLive}
      />

      {isOwnProfile && (
        <div className="container mx-auto px-4 -mt-4 mb-8">
          <CreatePostArea
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onFileSelect={setSelectedFiles}
            onOpenGoLive={onGoLive || (() => {})}
            isPayingCustomer={profile.is_paying_customer}
          />
        </div>
      )}

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </>
  );
};