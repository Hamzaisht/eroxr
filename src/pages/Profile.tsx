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
import { Instagram, Facebook, Twitter, Share2, Users, Image, Heart } from "lucide-react";

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
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
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
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="w-full">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="container mx-auto px-4">
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : profile ? (
          <>
            {/* Banner and Profile Section */}
            <div className="relative">
              {/* Banner Image */}
              <div className="h-64 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="Profile Banner"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Profile Info Overlay */}
              <div className="container mx-auto px-4">
                <div className="relative -mt-24 pb-4">
                  {/* Profile Picture */}
                  <div className="absolute left-4 -top-16">
                    <Avatar className="h-32 w-32 border-4 border-background">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl">
                        {profile.username?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Profile Header */}
                  <div className="ml-40 flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold">{profile.username}</h1>
                      <p className="text-muted-foreground">{profile.bio}</p>
                      
                      {/* Stats */}
                      <div className="flex gap-6 mt-2">
                        <div className="text-center">
                          <div className="font-semibold">4,355</div>
                          <div className="text-sm text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">2,986</div>
                          <div className="text-sm text-muted-foreground">Following</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">55</div>
                          <div className="text-sm text-muted-foreground">Images</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="bg-luxury-primary hover:bg-luxury-secondary text-white">
                        Follow
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="ml-40 flex gap-4 mt-4">
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="container mx-auto px-4 py-8">
              <Tabs defaultValue="showcase" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="showcase">Showcase</TabsTrigger>
                  <TabsTrigger value="created">
                    <Image className="h-4 w-4 mr-2" />
                    Created
                  </TabsTrigger>
                  <TabsTrigger value="collected">
                    <Users className="h-4 w-4 mr-2" />
                    Collected
                  </TabsTrigger>
                  <TabsTrigger value="likes">
                    <Heart className="h-4 w-4 mr-2" />
                    Likes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="showcase" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add showcase content here */}
                  </div>
                </TabsContent>

                <TabsContent value="created" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add created content here */}
                  </div>
                </TabsContent>

                <TabsContent value="collected" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add collected content here */}
                  </div>
                </TabsContent>

                <TabsContent value="likes" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add liked content here */}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-muted-foreground">
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