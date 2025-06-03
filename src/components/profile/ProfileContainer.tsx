
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileContent } from "./ProfileContent";
import { ProfileEditModal } from "./ProfileEditModal";
import { AvatarUpload } from "./upload/AvatarUpload";
import { BannerUpload } from "./upload/BannerUpload";

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
    fetchProfile(); // Refresh profile data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Profile not found</h1>
          <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Banner Section */}
        <div className="relative mb-8">
          {isOwnProfile ? (
            <BannerUpload
              currentBannerUrl={profile.banner_url}
              profileId={profile.id}
              onSuccess={handleBannerSuccess}
            />
          ) : (
            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10">
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
                <div className="w-full h-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
              )}
            </div>
          )}
        </div>

        {/* Profile Picture and Header */}
        <div className="relative -mt-24 md:-mt-32 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6">
            {/* Avatar */}
            <div className="relative">
              {isOwnProfile ? (
                <AvatarUpload
                  currentAvatarUrl={profile.avatar_url}
                  profileId={profile.id}
                  onSuccess={handleAvatarSuccess}
                  size={160}
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {profile.username?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {profile.username}
              </h1>
              {profile.bio && (
                <p className="text-gray-300 mb-4 max-w-2xl">
                  {profile.bio}
                </p>
              )}
              {profile.location && (
                <p className="text-gray-400 mb-4">
                  📍 {profile.location}
                </p>
              )}
              
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <ProfileContent profile={profile} isOwnProfile={isOwnProfile} />
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
