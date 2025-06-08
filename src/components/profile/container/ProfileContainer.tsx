
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
    <div className="min-h-screen bg-luxury-gradient relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(155,135,245,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(155,135,245,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-luxury-primary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-luxury-accent/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-luxury-secondary/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
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
    </div>
  );
};
