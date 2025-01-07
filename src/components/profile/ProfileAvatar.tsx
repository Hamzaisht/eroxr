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
  user_id?: string;
  timestamp?: string;
}

export const ProfileAvatar = ({ profile, getMediaType, isOwnProfile }: ProfileAvatarProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");

  useEffect(() => {
    if (!profile?.id) return;

    // Create and subscribe to the channel
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        const userState = Object.values(state).flat().find(
          presence => presence.user_id === profile.id
        );
        
        if (userState?.status) {
          setAvailability(userState.status as AvailabilityStatus);
        } else {
          setAvailability("offline");
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && isOwnProfile) {
          await channel.track({
            user_id: profile.id,
            status: availability,
            timestamp: new Date().toISOString()
          });
        }
      });

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
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent backdrop-blur-xl border-none">
          {getMediaType(profile?.avatar_url) === 'video' ? (
            <video
              src={profile?.avatar_url}
              className="w-full rounded-2xl"
              controls
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img
              src={profile?.avatar_url}
              alt="Profile"
              className="w-full rounded-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};