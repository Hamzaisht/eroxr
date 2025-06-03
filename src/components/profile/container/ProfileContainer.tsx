
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileEditModal } from "../ProfileEditModal";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileContent } from "./ProfileContent";
import { LoadingScreen } from "./LoadingScreen";
import { NotFoundScreen } from "./NotFoundScreen";

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

export const ProfileContainer = ({ id }: ProfileContainerProps) => {
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
      
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', id)
        .single();

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

  const handleMediaSuccess = (type: 'avatar' | 'banner', newUrl: string) => {
    setProfile(prev => prev ? { 
      ...prev, 
      [type === 'avatar' ? 'avatar_url' : 'banner_url']: newUrl 
    } : null);
    
    toast({
      title: "Success",
      description: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated successfully!`
    });
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchProfile();
  };

  if (loading) return <LoadingScreen />;
  if (!profile) return <NotFoundScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ProfileHeader 
        profile={profile}
        isOwnProfile={isOwnProfile}
        onMediaSuccess={handleMediaSuccess}
        onEditClick={() => setShowEditModal(true)}
      />
      
      <ProfileContent profile={profile} isOwnProfile={isOwnProfile} />

      {showEditModal && (
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
