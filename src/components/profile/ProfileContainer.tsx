
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileContainerProps {
  id?: string;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing = false, setIsEditing }: ProfileContainerProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const targetId = id || session?.user?.id;
        if (!targetId) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", targetId)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          throw error;
        }

        setProfile(data);
      } catch (error: any) {
        console.error("Full error details:", error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user || id) {
      fetchProfile();
    }
  }, [session?.user, id, toast]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-luxury-dark">
        <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] w-full bg-luxury-darker/50 animate-pulse" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 md:-mt-24 flex flex-col items-center gap-4 sm:gap-6">
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full" />
            <Skeleton className="w-3/4 sm:w-2/3 md:w-1/2 h-8" />
            <Skeleton className="w-2/3 sm:w-1/2 md:w-1/3 h-4" />
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === (id || session?.user?.id);

  return (
    <div className="w-full min-h-screen bg-luxury-dark">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <div className="max-w-screen-2xl mx-auto">
        <ProfileTabs profile={profile} />
      </div>
    </div>
  );
};
