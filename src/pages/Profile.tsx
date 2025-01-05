import { useParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { VerificationForm } from "@/components/profile/VerificationForm";
import { PricingForm } from "@/components/profile/PricingForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart, MessageCircle, Share2, Users } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const session = useSession();
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
        .select("*, id_verifications(status)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // If no ID is provided, or if the ID matches the current user's ID,
  // show the edit profile view
  const isOwnProfile = !id || (session?.user && session.user.id === id);

  if (isOwnProfile) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
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
        </main>
      </div>
    );
  }

  // Show public profile view for other users
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-[250px]" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : profile ? (
            <div className="space-y-6">
              <Card className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">
                      {profile.username?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold">{profile.username}</h1>
                      {profile.location && (
                        <p className="text-muted-foreground">{profile.location}</p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "This feature will be available soon!",
                          });
                        }}
                      >
                        <Users className="h-4 w-4" />
                        Follow
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "This feature will be available soon!",
                          });
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "This feature will be available soon!",
                          });
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "This feature will be available soon!",
                          });
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {profile.bio && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </Card>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
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
      </main>
    </div>
  );
};

export default Profile;