import { Button } from "@/components/ui/button";
import { Share2, CircuitBoard } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileStats } from "./ProfileStats";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  // Function to determine media type
  const getMediaType = (url: string) => {
    if (!url) return 'image';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'webm'].includes(extension || '')) return 'video';
    if (extension === 'gif') return 'gif';
    return 'image';
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.div style={{ opacity, scale }}>
        <ProfileBanner profile={profile} getMediaType={getMediaType} />
        <ProfileStats />
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-32 pb-4 z-30">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative"
          >
            <ProfileAvatar profile={profile} getMediaType={getMediaType} />

            <div className="mt-6 flex justify-between items-start">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-button-gradient">
                  {profile?.username}
                </h1>
                <p className="text-luxury-neutral mt-2 max-w-2xl text-lg leading-relaxed">
                  {profile?.bio || "No bio yet"}
                </p>
                <div className="flex gap-2 items-center text-luxury-neutral/70">
                  <CircuitBoard className="h-4 w-4" />
                  <span>Joined {new Date().toLocaleDateString()}</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                {!isOwnProfile && (
                  <Button 
                    className="bg-luxury-primary hover:bg-luxury-secondary text-white px-8 py-6 rounded-xl text-lg font-medium
                    relative overflow-hidden group"
                  >
                    <span className="relative z-10">Follow</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-accent to-luxury-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="animate-neon-glow w-14 h-14 rounded-xl border-luxury-primary/30"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};