import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TabsContainer } from "@/components/profile/tabs/TabsContainer";
import { ProfileDialogs } from "@/components/profile/dialogs/ProfileDialogs";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/components/profile/types";

const Profile = () => {
  const { id } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLiveDialogOpen, setIsLiveDialogOpen] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", id || session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id || session?.user?.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!(id || session?.user?.id),
  });

  const handleSave = async () => {
    try {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
    });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add a proper loading component
  }

  if (error) {
    return <div>Error loading profile</div>; // Add a proper error component
  }

  const isOwnProfile = session?.user?.id === (id || session?.user?.id);

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <main className="w-full">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile}
          onGoLive={() => setIsLiveDialogOpen(true)}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {profile && (
              <TabsContainer 
                profile={profile}
                isEditing={isEditing}
                onSave={handleSave}
              />
            )}
          </div>
        </div>
      </main>

      <ProfileDialogs
        isLiveDialogOpen={isLiveDialogOpen}
        setIsLiveDialogOpen={setIsLiveDialogOpen}
      />
    </div>
  );
};

export default Profile;
