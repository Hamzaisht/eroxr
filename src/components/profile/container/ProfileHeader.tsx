
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Users, Heart, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  onMediaSuccess: (type: 'avatar' | 'banner', newUrl: string) => void;
  onEditClick: () => void;
}

export const ProfileHeader = ({ 
  profile, 
  isOwnProfile, 
  onMediaSuccess, 
  onEditClick 
}: ProfileHeaderProps) => {
  return (
    <div className="relative">
      {/* Banner Section - Borderless */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/10 to-luxury-secondary/20 overflow-hidden">
        {profile.banner_url ? (
          <img 
            src={profile.banner_url} 
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-luxury-secondary/10 flex items-center justify-center relative">
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-luxury-primary/20 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    scale: 0 
                  }}
                  animate={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <div className="text-center relative z-10">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-12 h-12 text-luxury-primary" />
              </div>
              <p className="text-luxury-muted font-medium">Showcase your creative world</p>
            </div>
          </div>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/40 via-transparent to-transparent" />
      </div>

      {/* Profile Info Section - Floating design */}
      <div className="relative -mt-20 px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar - Enhanced with glow effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-32 h-32 p-1 bg-gradient-to-br from-luxury-primary via-luxury-accent to-luxury-secondary rounded-full shadow-2xl shadow-luxury-primary/20">
              <Avatar className="w-full h-full shadow-inner">
                <AvatarImage 
                  src={profile.avatar_url || undefined} 
                  alt={profile.username || 'Profile'} 
                />
                <AvatarFallback className="bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 text-luxury-primary text-3xl font-bold backdrop-blur-sm">
                  {(profile.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 rounded-full blur-xl -z-10" />
          </motion.div>

          {/* Profile Details - Enhanced typography */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-luxury-neutral via-luxury-primary to-luxury-accent bg-clip-text text-transparent mb-2 font-display">
                  {profile.username || 'Anonymous User'}
                </h1>
                {profile.bio && (
                  <p className="text-luxury-muted text-lg max-w-2xl leading-relaxed font-medium">
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-luxury-muted">
                {profile.location && (
                  <div className="flex items-center gap-2 bg-luxury-dark/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-luxury-dark/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Stats - Enhanced with glass morphism */}
              <div className="flex items-center gap-6 pt-2">
                <div className="text-center bg-luxury-dark/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-luxury-primary/10">
                  <div className="text-xl font-bold text-luxury-neutral">0</div>
                  <div className="text-sm text-luxury-muted">Posts</div>
                </div>
                <div className="text-center bg-luxury-dark/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-luxury-primary/10">
                  <div className="text-xl font-bold text-luxury-neutral">0</div>
                  <div className="text-sm text-luxury-muted">Followers</div>
                </div>
                <div className="text-center bg-luxury-dark/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-luxury-primary/10">
                  <div className="text-xl font-bold text-luxury-neutral">0</div>
                  <div className="text-sm text-luxury-muted">Following</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions - Fixed Edit Button */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="shrink-0"
          >
            {isOwnProfile ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onEditClick}
                  className="bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 hover:from-luxury-primary/30 hover:to-luxury-accent/30 text-luxury-primary border border-luxury-primary/30 hover:border-luxury-primary/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm shadow-lg"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline"
                    className="border-luxury-primary/30 text-luxury-neutral hover:bg-luxury-primary/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
