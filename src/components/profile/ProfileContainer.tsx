
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProfileHeaderContainer } from "./header/ProfileHeaderContainer";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileStats } from "./ProfileStats";
import { ProfileInfo } from "./ProfileInfo";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileContainerProps {
  id?: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const session = useSession();
  const isOwnProfile = session?.user?.id === id;

  const { data: profile, isLoading, error } = useQuery({
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
    retry: 2,
    staleTime: 60000, // Cache for 1 minute
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

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading profile: {(error as Error).message || "An unknown error occurred"}. 
            Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center px-4">
        <Alert className="max-w-md bg-luxury-darker border-luxury-primary/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Profile not found. This user may not exist or has been removed.
          </AlertDescription>
        </Alert>
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
        
        <ProfileInfo profile={profile} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-none py-6"
        >
          <ProfileStats profileId={profile.id} />
          <ProfileTabs profile={profile} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
