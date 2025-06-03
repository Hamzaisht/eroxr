
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileEditModal } from "./ProfileEditModal";
import { AvatarUpload } from "./upload/AvatarUpload";
import { BannerUpload } from "./upload/BannerUpload";
import { motion } from "framer-motion";
import { MapPin, Calendar, Edit, Camera, Users, Heart, MessageCircle, Share2 } from "lucide-react";

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

interface ProfileContainerProps {
  id: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const isOwnProfile = session?.user?.id === profile?.id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Try to find by username first
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', id)
        .single();

      // If not found by username, try by ID
      if (error && error.code === 'PGRST116') {
        const { data: profileByIdData, error: idError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        profileData = profileByIdData;
        error = idError;
      }

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive"
        });
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSuccess = (newAvatarUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
    toast({
      title: "Success",
      description: "Profile picture updated successfully!"
    });
  };

  const handleBannerSuccess = (newBannerUrl: string) => {
    setProfile(prev => prev ? { ...prev, banner_url: newBannerUrl } : null);
    toast({
      title: "Success", 
      description: "Banner updated successfully!"
    });
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Profile not found</h1>
          <p className="text-slate-400">The profile you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Professional Header Section */}
      <div className="relative">
        {/* Banner Section */}
        <div className="relative h-80 overflow-hidden">
          {isOwnProfile ? (
            <BannerUpload
              currentBannerUrl={profile.banner_url}
              profileId={profile.id}
              onSuccess={handleBannerSuccess}
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
              {/* Gradient Overlay */}
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
                    onSuccess={handleAvatarSuccess}
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
                        onClick={() => setShowEditModal(true)}
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

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
                About
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                {profile.bio || "This user hasn't added a bio yet."}
              </p>
            </motion.div>

            {/* Activity Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
                Recent Activity
              </h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-lg">No recent activity to show</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">Followers</span>
                  </div>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-slate-300">Likes</span>
                  </div>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>
            </motion.div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">Profile Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Member since</span>
                  <span className="text-white">{formatDate(profile.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last updated</span>
                  <span className="text-white">{formatDate(profile.updated_at)}</span>
                </div>
                {profile.location && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location</span>
                    <span className="text-white">{profile.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && profile && (
        <ProfileEditModal
          profile={profile}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};
