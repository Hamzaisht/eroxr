import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Users, Image } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  return (
    <div className="relative">
      {/* Animated Banner with Parallax Effect */}
      <motion.div 
        className="h-80 w-full overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-luxury-gradient opacity-50" />
        <img
          src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
          alt="Profile Banner"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        {/* Floating Stats Cards */}
        <div className="absolute bottom-4 right-4 flex gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-3 flex items-center gap-2"
          >
            <Users className="h-4 w-4 text-luxury-primary" />
            <span className="text-white font-medium">4.3K</span>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-3 flex items-center gap-2"
          >
            <Heart className="h-4 w-4 text-luxury-accent" />
            <span className="text-white font-medium">12.8K</span>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-3 flex items-center gap-2"
          >
            <Image className="h-4 w-4 text-luxury-neutral" />
            <span className="text-white font-medium">286</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Profile Info Section */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 pb-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative"
          >
            <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-4xl bg-luxury-primary text-white">
                {profile?.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <div className="animate-pulse-ring rounded-full bg-luxury-accent w-6 h-6" />
            </div>
          </motion.div>

          <div className="mt-4 flex justify-between items-start">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-button-gradient">
                {profile?.username}
              </h1>
              <p className="text-luxury-neutral mt-2 max-w-2xl">
                {profile?.bio || "No bio yet"}
              </p>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-2"
            >
              {!isOwnProfile && (
                <Button className="bg-luxury-primary hover:bg-luxury-secondary text-white">
                  Follow
                </Button>
              )}
              <Button variant="outline" size="icon" className="animate-neon-glow">
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};