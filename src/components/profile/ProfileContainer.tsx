import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/profile";
import { ProfileHeader } from "./ProfileHeader";
import { TabsContainer } from "./tabs/TabsContainer";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";

interface ProfileContainerProps {
  id?: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const session = useSession();
  const userId = id || session?.user?.id;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (error || !profile) {
    return <ErrorState message="Error loading profile" />;
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <main className="flex-1">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <TabsContainer 
            profile={profile}
            isEditing={isEditing}
            onSave={() => setIsEditing(false)}
          />
        </div>
      </div>
    </main>
  );
};