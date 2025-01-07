import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileStats } from "./ProfileStats";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileActions } from "./ProfileActions";
import { ProfileEditModal } from "./ProfileEditModal";
import { AvailabilityIndicator, AvailabilityStatus } from "../ui/availability-indicator";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

interface PresenceState {
  presence_ref: string;
  status?: AvailabilityStatus;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [showBannerPreview, setShowBannerPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!profile?.id) return;

    // Subscribe to presence changes
    const presenceChannel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const userState = state[profile.id] as PresenceState[];
        
        if (userState && userState.length > 0) {
          const status = userState[0]?.status || "offline";
          setAvailability(status as AvailabilityStatus);
        } else {
          setAvailability("offline");
        }
      })
      .subscribe();

    setChannel(presenceChannel);

    // If it's the current user's profile, track their presence
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

  const updateStatus = async (newStatus: AvailabilityStatus) => {
    if (channel && isOwnProfile) {
      await channel.track({
        user_id: profile.id,
        status: newStatus,
        timestamp: new Date().toISOString()
      });
    }
  };

  const getMediaType = (url: string) => {
    if (!url) return 'image';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'webm'].includes(extension || '')) return 'video';
    if (extension === 'gif') return 'gif';
    return 'image';
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="relative" ref={containerRef}>
        <motion.div style={{ opacity, scale }}>
          <div 
            onClick={() => profile?.banner_url && setShowBannerPreview(true)}
            className="cursor-pointer"
          >
            <ProfileBanner profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
          </div>
          <ProfileStats />
        </motion.div>

        <div className="-mt-32 pb-4 z-30">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative px-4"
          >
            <div className="relative group">
              <div onClick={() => profile?.avatar_url && setShowAvatarPreview(true)} className="cursor-pointer">
                <ProfileAvatar profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
              </div>
              <div className="absolute -bottom-2 -right-2">
                {isOwnProfile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-1.5 h-auto rounded-full bg-white shadow-md hover:bg-white/90">
                        <AvailabilityIndicator status={availability} size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => updateStatus("online")} className="gap-2">
                        <AvailabilityIndicator status="online" size={12} />
                        <span>Online</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus("away")} className="gap-2">
                        <AvailabilityIndicator status="away" size={12} />
                        <span>Away</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus("busy")} className="gap-2">
                        <AvailabilityIndicator status="busy" size={12} />
                        <span>Busy</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus("offline")} className="gap-2">
                        <AvailabilityIndicator status="offline" size={12} />
                        <span>Appear Offline</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="p-1.5 rounded-full bg-white shadow-md">
                    <AvailabilityIndicator status={availability} size={16} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-start">
              <ProfileInfo profile={profile} />
              <ProfileActions 
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Avatar Preview Modal */}
      <Dialog open={showAvatarPreview} onOpenChange={setShowAvatarPreview}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
          <VisuallyHidden>
            <div>Profile Picture Preview</div>
          </VisuallyHidden>
          {profile?.avatar_url && (
            getMediaType(profile.avatar_url) === 'video' ? (
              <video
                src={profile.avatar_url}
                className="w-full rounded-lg"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={profile.avatar_url}
                alt="Profile Picture"
                className="w-full rounded-lg"
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Banner Preview Modal */}
      <Dialog open={showBannerPreview} onOpenChange={setShowBannerPreview}>
        <DialogContent className="sm:max-w-7xl p-0 overflow-hidden bg-transparent border-none">
          <VisuallyHidden>
            <div>Profile Banner Preview</div>
          </VisuallyHidden>
          {profile?.banner_url && (
            getMediaType(profile.banner_url) === 'video' ? (
              <video
                src={profile.banner_url}
                className="w-full rounded-lg"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={profile.banner_url}
                alt="Profile Banner"
                className="w-full rounded-lg"
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {isEditing && isOwnProfile && (
        <ProfileEditModal 
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </>
  );
};