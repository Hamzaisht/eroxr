
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Check, MessageCircle, UserPlus, UserMinus, Share, Settings, Crown, Zap, Edit, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { AvatarUpload } from "@/components/profile/upload/AvatarUpload";
import { BannerUpload } from "@/components/profile/upload/BannerUpload";
import { ParticleSystem } from "@/components/profile/effects/ParticleSystem";
import { GlassmorphismCard } from "@/components/profile/effects/GlassmorphismCard";

interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  created_at: string;
  is_verified?: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  posts_count: number;
  is_creator: boolean;
  subscription_price?: number;
  creator_status?: string;
  verification_level?: string;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollowToggle: (following: boolean) => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, isFollowing, onFollowToggle }: ProfileHeaderProps) => {
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);
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

  const handleMessage = () => {
    toast({ description: "Messaging feature coming soon!" });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `@${profile.username} on Eroxr`,
        text: profile.bio || `Check out @${profile.username}'s profile`,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({ description: "Profile link copied to clipboard!" });
    }
  };

  const handleAvatarSuccess = (newAvatarUrl: string) => {
    setCurrentProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  const handleBannerSuccess = (newBannerUrl: string) => {
    setCurrentProfile(prev => ({ ...prev, banner_url: newBannerUrl }));
  };

  return (
    <div className="w-full relative">
      {/* Subtle Particle System */}
      <ParticleSystem count={30} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Premium Banner Section - Compact */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-48 md:h-64 w-full overflow-hidden"
      >
        {/* Banner Content */}
        {isOwnProfile ? (
          <BannerUpload
            currentBannerUrl={currentProfile.banner_url}
            profileId={profile.id}
            onSuccess={handleBannerSuccess}
          />
        ) : (
          <div className="w-full h-full relative">
            {currentProfile.banner_url ? (
              currentProfile.banner_url.includes('.mp4') || currentProfile.banner_url.includes('.webm') ? (
                <video
                  src={currentProfile.banner_url}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentProfile.banner_url}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20" />
            )}
          </div>
        )}

        {/* Elegant overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </motion.div>

      {/* Profile Content Container - Compact Layout */}
      <div className="relative -mt-16 px-4 md:px-6 w-full z-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
            
            {/* Large Avatar Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative flex-shrink-0"
            >
              {isOwnProfile ? (
                <AvatarUpload
                  currentAvatarUrl={currentProfile.avatar_url}
                  profileId={profile.id}
                  onSuccess={handleAvatarSuccess}
                  size={160}
                />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-1 shadow-xl">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-900 relative group">
                    {currentProfile.avatar_url ? (
                      <img 
                        src={currentProfile.avatar_url} 
                        alt={profile.username}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {profile.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Verified Badge */}
              {profile.is_verified && (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-3 border-gray-900 shadow-xl"
                >
                  <Check className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Profile Info - Compact */}
            <div className="flex-1 min-w-0 w-full lg:w-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Name and Status */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                      @{profile.username}
                    </h1>
                    {profile.is_creator && (
                      <motion.div
                        animate={{ rotate: [0, 3, -3, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full border border-purple-500/50 backdrop-blur-xl"
                      >
                        <Crown className="w-4 h-4 text-purple-300" />
                        <span className="text-sm font-medium text-purple-200">{profile.creator_status || 'Creator'}</span>
                      </motion.div>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{profile.bio}</p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                  </div>
                </div>

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Posts", value: profile.posts_count, color: "text-cyan-400" },
                    { label: "Followers", value: profile.follower_count, color: "text-purple-400" },
                    { label: "Following", value: profile.following_count, color: "text-pink-400" },
                    { label: "Likes", value: profile.likes_count, color: "text-green-400" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (0.05 * index), duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="text-xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
                      <div className={`text-xs ${stat.color} font-medium uppercase tracking-wider`}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Compact Action Buttons */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-2 w-full lg:w-auto lg:min-w-[200px]"
            >
              {isOwnProfile ? (
                <>
                  <Button 
                    onClick={() => setShowEditModal(true)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium rounded-xl h-10 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white/10 rounded-xl h-10 backdrop-blur-xl hover:border-white/50 transition-all duration-300 font-medium"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  {profile.is_creator && profile.subscription_price && (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium rounded-xl h-10 shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Subscribe ${profile.subscription_price}/mo
                    </Button>
                  )}
                  <Button 
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`w-full font-medium rounded-xl h-10 transition-all duration-300 ${
                      isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/30 hover:border-white/50 backdrop-blur-xl' 
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg hover:shadow-cyan-500/30'
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={handleMessage}
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10 rounded-xl h-9 backdrop-blur-xl hover:border-white/50 transition-all duration-300 font-medium text-sm"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-xl h-9 font-medium shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 text-sm"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      Tip
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showEditModal && (
        <ProfileEditModal
          profile={currentProfile}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};
