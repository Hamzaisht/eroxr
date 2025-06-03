
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Check, MessageCircle, UserPlus, UserMinus, Share, Settings, Crown, Zap, Edit, DollarSign } from "lucide-react";
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
      {/* Particle System */}
      <ParticleSystem count={80} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Enhanced Banner Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative h-80 md:h-[32rem] w-full overflow-hidden"
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
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30" />
            )}
          </div>
        )}

        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20" />
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        
        {/* Floating particles specific to header */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 60 - 30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 6,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Profile Content Container */}
      <div className="relative -mt-32 px-4 md:px-8 w-full z-10">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col xl:flex-row items-start xl:items-end gap-8">
            
            {/* Enhanced Avatar Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative flex-shrink-0"
            >
              {isOwnProfile ? (
                <AvatarUpload
                  currentAvatarUrl={currentProfile.avatar_url}
                  profileId={profile.id}
                  onSuccess={handleAvatarSuccess}
                  size={240}
                />
              ) : (
                <div className="w-60 h-60 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500">
                  <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-900 relative group">
                    {currentProfile.avatar_url ? (
                      <img 
                        src={currentProfile.avatar_url} 
                        alt={profile.username}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white">
                          {profile.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Enhanced Verified Badge */}
              {profile.is_verified && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                  className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-2xl"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Profile Info */}
            <div className="flex-1 min-w-0 w-full xl:w-auto">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Name, Status and Creator Badge */}
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                      @{profile.username}
                    </h1>
                    {profile.is_creator && (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full border border-purple-500/50 backdrop-blur-xl shadow-lg"
                      >
                        <Crown className="w-5 h-5 text-purple-300" />
                        <span className="text-sm font-bold text-purple-200">{profile.creator_status || 'Creator'}</span>
                      </motion.div>
                    )}
                    {profile.verification_level === 'verified' && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full border border-green-500/50 backdrop-blur-xl"
                      >
                        <Check className="w-4 h-4 text-green-300" />
                        <span className="text-xs font-medium text-green-200">Verified</span>
                      </motion.div>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-gray-300 text-xl max-w-4xl leading-relaxed">{profile.bio}</p>
                  )}
                </div>

                {/* Enhanced Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-400">
                  {profile.location && (
                    <GlassmorphismCard className="px-4 py-2 hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                        <span className="font-medium">{profile.location}</span>
                      </div>
                    </GlassmorphismCard>
                  )}
                  <GlassmorphismCard className="px-4 py-2 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                    </div>
                  </GlassmorphismCard>
                </div>

                {/* Enhanced Glassmorphism Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Posts", value: profile.posts_count, icon: Zap, color: "text-cyan-400", gradient: "from-cyan-500/20 to-blue-500/20" },
                    { label: "Followers", value: profile.follower_count, icon: UserPlus, color: "text-purple-400", gradient: "from-purple-500/20 to-pink-500/20" },
                    { label: "Following", value: profile.following_count, icon: UserMinus, color: "text-pink-400", gradient: "from-pink-500/20 to-rose-500/20" },
                    { label: "Likes", value: profile.likes_count, icon: Check, color: "text-green-400", gradient: "from-green-500/20 to-emerald-500/20" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (0.1 * index), duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <GlassmorphismCard 
                        className={`text-center p-6 bg-gradient-to-br ${stat.gradient} hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 cursor-pointer group`}
                        intensity="heavy"
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
                        <div className="text-3xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                      </GlassmorphismCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Action Buttons - Made Smaller */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-3 w-full xl:w-auto xl:min-w-[280px]"
            >
              {isOwnProfile ? (
                <>
                  <Button 
                    onClick={() => setShowEditModal(true)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white/20 rounded-xl h-12 backdrop-blur-xl hover:border-white/50 transition-all duration-300 font-semibold"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  {profile.is_creator && profile.subscription_price && (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Subscribe ${profile.subscription_price}/month
                    </Button>
                  )}
                  <Button 
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`w-full font-semibold rounded-xl h-12 transition-all duration-300 ${
                      isFollowing 
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30 hover:border-white/50 backdrop-blur-xl' 
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg hover:shadow-cyan-500/50'
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
                      className="border-white/30 text-white hover:bg-white/20 rounded-xl h-11 backdrop-blur-xl hover:border-white/50 transition-all duration-300 font-medium"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-xl h-11 font-medium shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
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
