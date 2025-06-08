
import { motion } from "framer-motion";
import { MapPin, Calendar, Edit, Camera, Users, Heart, MessageCircle, Crown, Verified, Star, Settings, Share2, MoreHorizontal } from "lucide-react";
import { AvatarUpload } from "../upload/AvatarUpload";
import { BannerUpload } from "../upload/BannerUpload";
import { ProfileStats } from "../ProfileStats";

interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  onMediaSuccess: (type: 'avatar' | 'banner', newUrl: string) => void;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onMediaSuccess, onEditClick }: ProfileHeaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="relative">
      {/* Cinematic Banner Section */}
      <div className="relative h-[500px] overflow-hidden">
        {isOwnProfile ? (
          <BannerUpload
            currentBannerUrl={profile.banner_url}
            profileId={profile.id}
            onSuccess={(url) => onMediaSuccess('banner', url)}
          />
        ) : (
          <div className="w-full h-full bg-premium-gradient relative overflow-hidden">
            {profile.banner_url ? (
              profile.banner_url.includes('.mp4') || profile.banner_url.includes('.webm') ? (
                <video
                  src={profile.banner_url}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={profile.banner_url}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-premium-gradient flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="w-32 h-32 bg-luxury-primary/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-luxury-primary/30"
                >
                  <Camera className="w-16 h-16 text-luxury-primary" />
                </motion.div>
              </div>
            )}
            
            {/* Luxury cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-luxury-dark/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/30 via-transparent to-luxury-dark/30" />
          </div>
        )}

        {/* Floating Action Buttons */}
        {isOwnProfile && (
          <div className="absolute top-6 right-6 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-luxury-dark/80 backdrop-blur-xl border border-luxury-primary/30 rounded-xl flex items-center justify-center text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-luxury-dark/80 backdrop-blur-xl border border-luxury-primary/30 rounded-xl flex items-center justify-center text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {/* Premium Badge */}
        <div className="absolute top-6 left-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-dark/80 backdrop-blur-xl border border-luxury-primary/30 rounded-xl"
          >
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 font-medium text-sm">PREMIUM CREATOR</span>
            <Verified className="w-4 h-4 text-luxury-primary" />
          </motion.div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-end gap-8 mb-8">
            {/* Avatar with Premium Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-button-gradient rounded-full blur-xl opacity-50 animate-pulse" />
              {isOwnProfile ? (
                <AvatarUpload
                  currentAvatarUrl={profile.avatar_url}
                  profileId={profile.id}
                  onSuccess={(url) => onMediaSuccess('avatar', url)}
                  size={200}
                />
              ) : (
                <div className="relative w-48 h-48 rounded-full bg-button-gradient p-2 shadow-luxury">
                  <div className="w-full h-full rounded-full overflow-hidden bg-luxury-dark border-4 border-luxury-dark">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-premium-gradient flex items-center justify-center">
                        <span className="text-5xl font-bold text-white">
                          {profile.username?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Online Status Indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-luxury-success border-4 border-luxury-dark rounded-full animate-pulse shadow-lg" />
            </motion.div>

            {/* Profile Details */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="bg-luxury-dark/80 backdrop-blur-xl rounded-3xl p-8 border border-luxury-primary/20 shadow-luxury">
                {/* Username and Verification */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <h1 className="text-5xl font-bold text-luxury-neutral tracking-tight">
                      @{profile.username}
                    </h1>
                    <div className="flex items-center gap-2">
                      <Verified className="w-8 h-8 text-luxury-primary" />
                      <Crown className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {isOwnProfile ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={onEditClick}
                          className="flex items-center gap-2 bg-button-gradient hover:bg-hover-gradient text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-button hover:shadow-button-hover"
                        >
                          <Edit className="w-5 h-5" />
                          Edit Profile
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-luxury-dark/50 hover:bg-luxury-primary/20 text-luxury-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-luxury-primary/30 backdrop-blur-xl"
                        >
                          <Star className="w-5 h-5" />
                          Analytics
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-button-gradient hover:bg-hover-gradient text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-button hover:shadow-button-hover"
                        >
                          <Users className="w-5 h-5" />
                          Follow
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-luxury-dark/50 hover:bg-luxury-primary/20 text-luxury-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-luxury-primary/30 backdrop-blur-xl"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Message
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-luxury-accent/20 hover:bg-luxury-accent/30 text-luxury-accent px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-luxury-accent/30 backdrop-blur-xl"
                        >
                          <Heart className="w-5 h-5" />
                          Tip
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-12 bg-luxury-dark/50 hover:bg-luxury-primary/20 text-luxury-primary rounded-xl transition-all duration-300 border border-luxury-primary/30 backdrop-blur-xl flex items-center justify-center"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-luxury-muted text-lg mb-6 leading-relaxed max-w-3xl"
                  >
                    {profile.bio}
                  </motion.p>
                )}
                
                {/* Metadata */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap items-center gap-6 text-luxury-muted mb-6"
                >
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-luxury-primary" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-luxury-primary" />
                    <span className="font-medium">Joined {formatDate(profile.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">Premium Creator</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <ProfileStats profileId={profile.id} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
};
