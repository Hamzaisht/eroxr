import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/profile";
import { ProfileHeader } from "./ProfileHeader";
import { TabsContainer } from "./tabs/TabsContainer";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import { useToast } from "@/hooks/use-toast";

interface ProfileContainerProps {
  id?: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const userId = id || session?.user?.id;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("No user ID provided");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        toast({
          title: "Not Found",
          description: "Profile not found.",
          variant: "destructive",
        });
        throw new Error("Profile not found");
      }

      return data as Profile;
    },
    enabled: !!userId,
    retry: 1,
  });

  if (!session) {
    return <ErrorState message="Please sign in to view profiles" />;
  }

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (error) {
    console.error("Profile error:", error);
    return <ErrorState message="Error loading profile" />;
  }

  if (!profile) {
    return <ErrorState message="Profile not found" />;
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <main className="flex-1">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
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