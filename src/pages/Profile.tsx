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

const Profile = () => {
  const { id } = useParams();
  const session = useSession();

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

  // If no ID is provided, or if the ID matches the current user's ID,
  // show the edit forms
  if (!id || (session?.user && session.user.id === id)) {
    return (
      <div className="min-h-screen bg-luxury-gradient">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-luxury-neutral">Profile Settings</h1>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-luxury-dark/50 backdrop-blur-lg">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileForm />
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