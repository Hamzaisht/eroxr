import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TabsContainer } from "@/components/profile/tabs/TabsContainer";
import { ProfileDialogs } from "@/components/profile/dialogs/ProfileDialogs";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { id } = useParams();
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isLiveDialogOpen, setIsLiveDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id || session?.user?.id],
    queryFn: async () => {
      const queryId = id || session?.user?.id;
      if (!queryId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", queryId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!(id || session?.user?.id),
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    setSelectedFiles(files);
    if (files && files.length > 0) {
      setIsPostDialogOpen(true);
    }
  };

  const handleCreatePost = () => {
    setIsPostDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-gradient">
        <div className="animate-pulse space-y-4">
          <div className="h-80 w-full bg-luxury-dark/50" />
          <div className="container mx-auto px-4">
            <div className="h-40 w-40 rounded-full bg-luxury-dark/50" />
            <div className="h-8 w-64 mt-4 bg-luxury-dark/50" />
          </div>
        </div>
      </div>
    );
  }

  // If no ID is provided, or if the ID matches the current user's ID,
  // show the profile with edit capabilities
  if (!id || (session?.user && session.user.id === id)) {
    return (
      <div className="min-h-screen bg-luxury-gradient">
        <main className="w-full">
          <ProfileHeader 
            profile={profile} 
            isOwnProfile={true}
            onCreatePost={handleCreatePost}
            onGoLive={() => setIsLiveDialogOpen(true)}
          />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <TabsContainer 
                profile={profile}
                isEditing={isEditing}
                onSave={handleSave}
              />
            </div>
          </div>

          <ProfileDialogs 
            isPostDialogOpen={isPostDialogOpen}
            isLiveDialogOpen={isLiveDialogOpen}
            setIsPostDialogOpen={setIsPostDialogOpen}
            setIsLiveDialogOpen={setIsLiveDialogOpen}
            selectedFiles={selectedFiles}
            onFileSelect={handleFileSelect}
          />
        </main>
      </div>
    );
  }

  // Public profile view
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <main className="w-full">
        {profile ? (
          <>
            <ProfileHeader 
              profile={profile} 
              isOwnProfile={session?.user?.id === profile.id} 
            />
            <div className="container mx-auto px-4 py-8">
              <TabsContainer 
                profile={profile}
                isEditing={isEditing}
                onSave={handleSave}
              />
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-luxury-neutral">
                Profile not found
              </h1>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;