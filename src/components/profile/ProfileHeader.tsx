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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  useEffect(() => {
    if (!profile?.id) return;

    // Subscribe to presence changes
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
        status: "online",
        timestamp: new Date().toISOString()
      });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isOwnProfile]);

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
          <ProfileBanner profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
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
              <ProfileAvatar profile={profile} getMediaType={getMediaType} isOwnProfile={isOwnProfile} />
              <div className="absolute bottom-0 right-0 translate-x-1/4">
                <AvailabilityIndicator status={availability} size={16} />
              </div>
            </div>

            <div className="mt-6 flex justify-between items-start">
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

      {isEditing && isOwnProfile && (
        <ProfileEditModal 
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </>
  );
};