import React, { useState } from "react";
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
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  console.log("Profile page - User ID:", id || session?.user?.id);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", id || session?.user?.id],
    queryFn: async () => {
      console.log("Fetching profile for:", id || session?.user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id || session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Fetched profile:", data);
      return data as Profile;
    },
    enabled: !!(id || session?.user?.id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
        <div className="text-luxury-primary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
        <div className="text-red-500">Error loading profile</div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === (id || session?.user?.id);

  return (
    <div className="min-h-screen bg-luxury-dark">
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
                onSave={() => setIsEditing(false)}
              />
            )}
          </div>
        </div>
      </main>

      <ProfileDialogs
        isLiveDialogOpen={isLiveDialogOpen}
        setIsLiveDialogOpen={setIsLiveDialogOpen}
        isPostDialogOpen={isPostDialogOpen}
        setIsPostDialogOpen={setIsPostDialogOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </div>
  );
};

export default Profile;