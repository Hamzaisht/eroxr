import { useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { VerificationForm } from "@/components/profile/VerificationForm";
import { PricingForm } from "@/components/profile/PricingForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { TempDemoContent } from "@/components/TempDemoContent";

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
        .select("*, id_verifications(status)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const isOwnProfile = !id || (session?.user && session.user.id === id);

  if (!session) {
    return <TempDemoContent />;
  }

  if (isOwnProfile) {
    return (
      <div className="container mx-auto px-4 py-8 bg-luxury-dark min-h-[calc(100vh-64px)]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Profile Settings</h1>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-luxury-dark min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
            <ProfileContent profile={profile} />
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-muted-foreground">
                Profile not found
              </h1>
              <p className="text-muted-foreground mt-2">
                The profile you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;