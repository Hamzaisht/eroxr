import { useParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { VerificationForm } from "@/components/profile/VerificationForm";
import { PricingForm } from "@/components/profile/PricingForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { id } = useParams();
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error("Invalid profile ID format");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
    });
  };

  // If no ID is provided, or if the ID matches the current user's ID,
  // show the profile settings
  if (!id || (session?.user && session.user.id === id)) {
    return (
      <div className="min-h-screen bg-luxury-gradient">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-luxury-neutral">My Profile</h1>
              {!isEditing ? (
                <Button
                  variant="outline"
                  className="border-luxury-primary/20 bg-luxury-darker/40 hover:bg-luxury-primary/20"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
            
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
                  <div className="bg-luxury-dark/50 backdrop-blur-lg rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-luxury-neutral/60">Username</h3>
                      <p className="text-luxury-neutral">{profile?.username || "Not set"}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-luxury-neutral/60">Bio</h3>
                      <p className="text-luxury-neutral">{profile?.bio || "No bio yet"}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-luxury-neutral/60">Location</h3>
                      <p className="text-luxury-neutral">{profile?.location || "Not specified"}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-luxury-neutral/60">Interests</h3>
                      <p className="text-luxury-neutral">
                        {profile?.interests?.join(", ") || "No interests added"}
                      </p>
                    </div>
                  </div>
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
        </main>
      </div>
    );
  }

  // Public profile view
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <MainNav />
      <main className="w-full">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-80 w-full bg-luxury-dark/50" />
            <div className="container mx-auto px-4">
              <div className="h-40 w-40 rounded-full bg-luxury-dark/50" />
              <div className="h-8 w-64 mt-4 bg-luxury-dark/50" />
            </div>
          </div>
        ) : profile ? (
          <>
            <ProfileHeader profile={profile} isOwnProfile={session?.user?.id === profile.id} />
            <ProfileTabs profile={profile} />
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