import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AvatarStatus } from "./avatar/AvatarStatus";
import { ProfileAvatarImage } from "./avatar/AvatarImage";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { X } from "lucide-react";

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
  }, [profile?.id, isOwnProfile, availability]);

  const handleAvatarClick = () => {
    if (profile?.avatar_url) {
      setShowPreview(true);
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <div className="relative">
          <ProfileAvatarImage
            src={profile?.avatar_url}
            username={profile?.username}
            onImageClick={handleAvatarClick}
          />
          
          {isOwnProfile && (
            <div className="absolute -bottom-1 -right-1 z-10" onClick={e => e.stopPropagation()}>
              <AvatarStatus
                profileId={profile?.id}
                isOwnProfile={!!isOwnProfile}
                status={availability}
                onStatusChange={setAvailability}
              />
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-50"
          >
            <X className="h-5 w-5 text-white" />
          </button>
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