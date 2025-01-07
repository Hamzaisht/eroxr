import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { ProfileHeaderContainer } from "./header/ProfileHeaderContainer";
import { CreatePostDialog } from "@/components/CreatePostDialog";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onGoLive?: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onGoLive }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [showBannerPreview, setShowBannerPreview] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const presenceChannel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const userState = state[profile.id] as any[];
        
        if (userState && userState.length > 0) {
          const status = userState[0]?.status || "offline";
          setAvailability(status as AvailabilityStatus);
        } else {
          setAvailability("offline");
        }
      })
      .subscribe();

    setChannel(presenceChannel);

    if (isOwnProfile) {
      presenceChannel.track({
        user_id: profile.id,
        status: "online",
        timestamp: new Date().toISOString()
      });
    }

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [profile?.id, isOwnProfile]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

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
        handleSave={handleSave}
        handleClose={handleClose}
        setIsEditing={setIsEditing}
        onCreatePost={() => setIsCreatePostOpen(true)}
        onGoLive={onGoLive}
      />

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </>
  );
};