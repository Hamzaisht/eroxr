
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Check, MessageCircle, UserPlus, UserMinus, Share, Settings, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { format } from "date-fns";

interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  created_at: string;
  is_verified?: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  posts_count: number;
  is_creator: boolean;
  subscription_price?: number;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollowToggle: (following: boolean) => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, isFollowing, onFollowToggle }: ProfileHeaderProps) => {
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleFollowToggle = async () => {
    if (!session?.user) return;
    
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', session.user.id)
          .eq('following_id', profile.id);
        onFollowToggle(false);
        toast({ description: `Unfollowed @${profile.username}` });
      } else {
        await supabase
          .from('followers')
          .insert({
            follower_id: session.user.id,
            following_id: profile.id
          });
        onFollowToggle(true);
        toast({ description: `Following @${profile.username}` });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Glassmorphism Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="h-64 md:h-80 relative overflow-hidden"
      >
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-pink-500/20" />
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/20 border-b border-white/10" />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </motion.div>

      {/* Profile Content Container */}
      <div className="relative -mt-20 px-4 md:px-8 w-full">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
            
            {/* Enhanced Avatar Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative flex-shrink-0"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-900 relative">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {profile.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Live indicator for creators */}
                  {profile.is_creator && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                    />
                  )}
                </div>
              </div>
              
              {/* Enhanced Verified Badge */}
              {profile.is_verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-xl"
                >
                  <Check className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Profile Info */}
            <div className="flex-1 min-w-0 w-full lg:w-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6"
              >
                {/* Name and Status */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                      @{profile.username}
                    </h1>
                    {profile.is_creator && (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm"
                      >
                        <Crown className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Creator</span>
                      </motion.div>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-gray-300 text-xl max-w-3xl leading-relaxed">{profile.bio}</p>
                  )}
                </div>

                {/* Enhanced Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-400">
                  {profile.location && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{profile.location}</span>
                    </motion.div>
                  )}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                  </motion.div>
                </div>

                {/* Glassmorphism Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Posts", value: profile.posts_count, icon: Zap, color: "text-cyan-400" },
                    { label: "Followers", value: profile.follower_count, icon: UserPlus, color: "text-purple-400" },
                    { label: "Following", value: profile.following_count, icon: UserMinus, color: "text-pink-400" },
                    { label: "Likes", value: profile.likes_count, icon: Check, color: "text-green-400" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                      <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[240px]"
            >
              {isOwnProfile ? (
                <>
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-2xl h-12 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-2xl h-12 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  {profile.is_creator && profile.subscription_price && (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-2xl h-12 shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Subscribe ${profile.subscription_price}/month
                    </Button>
                  )}
                  <Button 
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`w-full font-semibold rounded-2xl h-12 transition-all duration-300 ${
                      isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30' 
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-2xl h-12 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
