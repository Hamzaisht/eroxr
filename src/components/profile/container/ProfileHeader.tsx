
import { motion } from "framer-motion";
import { MapPin, Calendar, Edit, Camera, Users, Heart, MessageCircle } from "lucide-react";
import { AvatarUpload } from "../upload/AvatarUpload";
import { BannerUpload } from "../upload/BannerUpload";

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
      {/* Banner Section */}
      <div className="relative h-80 overflow-hidden">
        {isOwnProfile ? (
          <BannerUpload
            currentBannerUrl={profile.banner_url}
            profileId={profile.id}
            onSuccess={(url) => onMediaSuccess('banner', url)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
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
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-slate-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
        )}
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {isOwnProfile ? (
                <AvatarUpload
                  currentAvatarUrl={profile.avatar_url}
                  profileId={profile.id}
                  onSuccess={(url) => onMediaSuccess('avatar', url)}
                  size={180}
                />
              ) : (
                <div className="w-44 h-44 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-4 border-slate-800">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {profile.username?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Profile Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 text-center md:text-left mb-4"
            >
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Joined {formatDate(profile.created_at)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {isOwnProfile ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onEditClick}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                      >
                        <Users className="w-4 h-4" />
                        Follow
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-600"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
