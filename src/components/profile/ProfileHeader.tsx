import { Button } from "@/components/ui/button";
import { Share2, CircuitBoard, Edit } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileBanner } from "./ProfileBanner";
import { ProfileStats } from "./ProfileStats";
import { ProfileForm } from "./ProfileForm";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  const getMediaType = (url: string) => {
    if (!url) return 'image';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'webm'].includes(extension || '')) return 'video';
    if (extension === 'gif') return 'gif';
    return 'image';
  };

  return (
    <>
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
              <div className="relative group">
                <ProfileAvatar profile={profile} getMediaType={getMediaType} />
                {isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-luxury-darker/80 hover:bg-luxury-primary/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 text-luxury-primary" />
                  </Button>
                )}
              </div>

              <div className="mt-6 flex justify-between items-start">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
                      {profile?.username}
                    </h1>
                  </div>
                  <p className="text-luxury-neutral/80 mt-2 max-w-2xl text-lg leading-relaxed backdrop-blur-sm">
                    {profile?.bio || "No bio yet"}
                  </p>
                  <div className="flex gap-2 items-center text-luxury-neutral/60">
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
                      className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white px-8 py-6 rounded-xl text-lg font-medium
                      relative overflow-hidden group transition-all duration-300"
                    >
                      <span className="relative z-10">Follow</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-accent to-luxury-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20 transition-all duration-300"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-14 h-14 rounded-xl border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20 transition-all duration-300"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {isEditing && isOwnProfile && (
        <div className="fixed inset-0 bg-luxury-darker/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-luxury-dark rounded-xl p-6 shadow-2xl border border-luxury-primary/10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gradient">Edit Profile</h1>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20"
                >
                  Cancel
                </Button>
              </div>
              <ProfileForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};