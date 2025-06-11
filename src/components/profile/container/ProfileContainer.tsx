
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";

interface ProfileContainerProps {
  id: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = session?.user?.id === id;

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleMediaSuccess = async (type: 'avatar' | 'banner', newUrl: string) => {
    try {
      const updateData = type === 'avatar' 
        ? { avatar_url: newUrl }
        : { banner_url: newUrl };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Profile picture' : 'Banner'} updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
          onEditClick={() => setIsEditing(true)}
        />
        
        <ProfileTabs
          profile={profile}
          isOwnProfile={isOwnProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};
