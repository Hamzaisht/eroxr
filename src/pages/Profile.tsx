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

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data as Profile;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
        <div className="text-luxury-primary">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
        <div className="text-red-500">Error loading profile</div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

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
            <TabsContainer 
              profile={profile}
              isEditing={isEditing}
              onSave={() => setIsEditing(false)}
            />
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