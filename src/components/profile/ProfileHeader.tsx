import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Users, Image, CircuitBoard, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Animated Banner with Parallax and Interactive Effects */}
      <motion.div 
        className="h-[60vh] w-full overflow-hidden relative"
        style={{ opacity, scale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-luxury-gradient opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.15)_0%,transparent_70%)] animate-pulse" />
        <img
          src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
          alt="Profile Banner"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        
        {/* Floating Stats Cards with Enhanced Design */}
        <div className="absolute bottom-8 right-4 flex gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-effect rounded-2xl p-4 flex items-center gap-3 border border-white/10"
          >
            <Users className="h-5 w-5 text-luxury-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="text-white font-medium">4.3K</span>
              <span className="text-xs text-white/70">Followers</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-effect rounded-2xl p-4 flex items-center gap-3 border border-white/10"
          >
            <Heart className="h-5 w-5 text-luxury-accent animate-pulse" />
            <div className="flex flex-col">
              <span className="text-white font-medium">12.8K</span>
              <span className="text-xs text-white/70">Likes</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-effect rounded-2xl p-4 flex items-center gap-3 border border-white/10"
          >
            <Image className="h-5 w-5 text-luxury-neutral animate-pulse" />
            <div className="flex flex-col">
              <span className="text-white font-medium">286</span>
              <span className="text-xs text-white/70">Posts</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Profile Info Section */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-32 pb-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="relative group">
              <Avatar className="h-48 w-48 border-4 border-background shadow-xl rounded-3xl">
                <AvatarImage src={profile?.avatar_url} className="rounded-3xl" />
                <AvatarFallback className="text-4xl bg-luxury-primary text-white rounded-3xl">
                  {profile?.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <div className="animate-pulse-ring rounded-full bg-luxury-accent w-6 h-6" />
                <CircuitBoard className="absolute inset-0 h-6 w-6 text-white animate-spin-slow" />
              </div>
              <div className="absolute inset-0 bg-luxury-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

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