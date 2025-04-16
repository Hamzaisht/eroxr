
import { useState } from "react";
import { AvatarStatus } from "./avatar/AvatarStatus";
import { ProfileAvatarImage } from "./avatar/AvatarImage";
import { ImageCropDialog } from "./ImageCropDialog";
import { useAvatarUpload } from "./avatar/AvatarUpload";
import { usePresence } from "./avatar/usePresence";
import { AvatarPreview } from "./avatar/AvatarPreview";
import type { ProfileAvatarProps } from "./avatar/types";
import { AvailabilityStatus } from "@/utils/media/types";

export const ProfileAvatar = ({ profile, getMediaType, isOwnProfile }: ProfileAvatarProps) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const { 
    availability, 
    setAvailability,
    setIsInCall,
    setIsMessaging
  } = usePresence(profile?.id, !!isOwnProfile);
  
  const {
    showCropDialog,
    setShowCropDialog,
    tempImageUrl,
    setTempImageUrl,
    setSelectedFile,
    handleFileSelect,
    handleCropComplete
  } = useAvatarUpload({
    profile,
    onSuccess: () => window.location.reload()
  });

  const handleAvatarClick = () => {
    if (profile?.avatar_url) {
      setShowPreview(true);
    }
  };

  // Create a wrapper function that ensures the correct type for React state setters
  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    // TypeScript treats this as a valid state update
    setAvailability(newStatus);
  };

  return (
    <>
      <div className="relative inline-block">
        <div className="relative">
          <ProfileAvatarImage
            src={profile?.avatar_url}
            username={profile?.username}
            onImageClick={handleAvatarClick}
            onFileSelect={isOwnProfile ? handleFileSelect : undefined}
          />
          
          {isOwnProfile && (
            <div className="absolute -bottom-1 -right-1 z-10" onClick={e => e.stopPropagation()}>
              <AvatarStatus
                profileId={profile?.id}
                isOwnProfile={!!isOwnProfile}
                status={availability}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </div>
      </div>

      <AvatarPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        mediaUrl={profile?.avatar_url}
        mediaType={getMediaType(profile?.avatar_url)}
      />

      {showCropDialog && tempImageUrl && (
        <ImageCropDialog
          isOpen={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            setTempImageUrl('');
            setSelectedFile(null);
          }}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          isCircular={true}
        />
      )}
    </>
  );
};
