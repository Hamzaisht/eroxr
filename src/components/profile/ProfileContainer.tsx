
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeaderContainer } from "./header/ProfileHeaderContainer";
import { ProfileTabs } from "./ProfileTabs";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";

interface ProfileContainerProps {
  id?: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const session = useSession();
  const isOwnProfile = session?.user?.id === id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          <p className="text-luxury-neutral">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-luxury-neutral">Profile not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <ProfileHeaderContainer
          profile={profile}
          isOwnProfile={isOwnProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-none"
        >
          <ProfileStats profileId={profile.id} />
          <ProfileTabs profile={profile} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
