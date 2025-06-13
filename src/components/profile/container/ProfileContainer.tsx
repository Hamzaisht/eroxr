
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileEditDialog } from "../ProfileEditDialog";

interface ProfileContainerProps {
  id: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const isOwnProfile = user?.id === id;

  console.log('ProfileContainer Debug:', {
    currentUserId: user?.id,
    profileId: id,
    isOwnProfile,
    userExists: !!user
  });

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      console.log('Fetching profile for ID:', id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      console.log('Profile fetched:', data);
      return data;
    }
  });

  const handleMediaSuccess = async (type: 'avatar' | 'banner', newUrl: string) => {
    try {
      console.log('🔧 ProfileContainer: Using RPC bypass function for media update');
      
      const updateData = type === 'avatar' 
        ? { p_avatar_url: newUrl }
        : { p_banner_url: newUrl };

      // Use the bypass RPC function instead of direct update
      const { error } = await supabase.rpc('update_profile_bypass_rls', {
        p_user_id: id,
        ...updateData
      });

      if (error) {
        console.error('❌ ProfileContainer: RPC bypass function error:', error);
        throw error;
      }

      console.log('✅ ProfileContainer: Media updated successfully via RPC bypass');

      await refetch();
      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated successfully`,
      });
    } catch (error: any) {
      console.error('💥 ProfileContainer: Media update error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked, opening dialog');
    setEditDialogOpen(true);
  };

  const handleEditSuccess = async () => {
    console.log('Edit success, refetching profile');
    await refetch();
    setEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-luxury-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-luxury-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-luxury-neutral mb-4">Profile Error</h1>
          <p className="text-luxury-muted">Failed to load profile</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-screen bg-luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-luxury-neutral mb-4">Profile Not Found</h1>
          <p className="text-luxury-muted">This profile doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-luxury-gradient relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(155,135,245,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(155,135,245,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-luxury-primary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-luxury-accent/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Profile content */}
      <div className="relative z-10">
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onMediaSuccess={handleMediaSuccess}
          onEditClick={handleEditClick}
        />
        
        <ProfileTabs
          profile={profile}
          isOwnProfile={isOwnProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Edit Dialog */}
      <ProfileEditDialog
        profile={profile}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};
