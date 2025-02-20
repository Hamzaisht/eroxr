
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeaderContainer } from "./header/ProfileHeaderContainer";
import { ProfileTabs } from "./ProfileTabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/integrations/supabase/types/profile";

interface ProfileContainerProps {
  id?: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing, setIsEditing }: ProfileContainerProps) => {
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
      return data as Profile;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <Skeleton className="w-full h-[60vh]" />
        <div className="container mx-auto px-4">
          <Skeleton className="h-32 w-32 rounded-full mx-auto -mt-16" />
          <div className="space-y-4 mt-8">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-luxury-neutral">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <ProfileHeaderContainer 
        profile={profile}
        isOwnProfile={true}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <div className="flex-1 container mx-auto px-4 py-8">
        <ProfileTabs profile={profile} />
      </div>
    </div>
  );
};
