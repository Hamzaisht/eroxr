import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AvatarStatus } from "./avatar/AvatarStatus";
import { AvatarImage } from "./avatar/AvatarImage";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";

interface ProfileAvatarProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

interface PresenceState {
  presence_ref: string;
  status?: AvailabilityStatus;
}

export const ProfileAvatar = ({ profile, getMediaType, isOwnProfile }: ProfileAvatarProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");

  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userState = state[profile.id] as PresenceState[];
        
        if (userState && userState.length > 0) {
          const status = userState[0]?.status || "offline";
          setAvailability(status as AvailabilityStatus);
        } else {
          setAvailability("offline");
        }
      })
      .subscribe();

    // If it's the current user's profile, track their presence
    if (isOwnProfile) {
      channel.track({
        user_id: profile.id,
        status: availability,
        timestamp: new Date().toISOString()
      });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isOwnProfile]);

  return (
    <>
      <div className="relative inline-block group">
        <AvatarImage
          src={profile?.avatar_url}
          username={profile?.username}
          onClick={() => profile?.avatar_url && setShowPreview(true)}
        />
        
        <div className="absolute -bottom-1 -right-1">
          <AvatarStatus
            profileId={profile?.id}
            isOwnProfile={!!isOwnProfile}
            status={availability}
            onStatusChange={setAvailability}
          />
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
          {getMediaType(profile?.avatar_url) === 'video' ? (
            <video
              src={profile?.avatar_url}
              className="w-full rounded-lg"
              controls
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img
              src={profile?.avatar_url}
              alt="Profile"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};