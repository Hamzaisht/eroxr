import { useParams } from "react-router-dom";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { VerificationForm } from "@/components/profile/VerificationForm";
import { PricingForm } from "@/components/profile/PricingForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { CreatorsFeed } from "@/components/CreatorsFeed";

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
            onCreatePost={() => setIsPostDialogOpen(true)}
            onGoLive={() => setIsLiveDialogOpen(true)}
          />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-luxury-dark/50 backdrop-blur-lg">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  {isEditing ? (
                    <ProfileForm onSave={handleSave} />
                  ) : (
                    <>
                      <ProfileTabs profile={profile} />
                      <div className="mt-8">
                        <CreatorsFeed />
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="verification">
                  <VerificationForm />
                </TabsContent>
                
                <TabsContent value="pricing">
                  <PricingForm />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <CreatePostDialog
            open={isPostDialogOpen}
            onOpenChange={setIsPostDialogOpen}
            selectedFiles={selectedFiles}
            onFileSelect={setSelectedFiles}
          />

          <GoLiveDialog
            open={isLiveDialogOpen}
            onOpenChange={setIsLiveDialogOpen}
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
              <ProfileTabs profile={profile} />
              <div className="mt-8">
                <CreatorsFeed />
              </div>
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