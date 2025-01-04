import { useParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { id } = useParams();
  const session = useSession();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      
      // Validate if the ID is a valid UUID
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
    enabled: !!id, // Only run query if we have an ID
  });

  // If no ID is provided, or if the ID matches the current user's ID,
  // show the edit form
  if (!id || (session?.user && session.user.id === id)) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
            <ProfileForm />
          </div>
        </main>
      </div>
    );
  }

  // Otherwise, show the public profile view
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-[250px]" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : profile ? (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                  {profile.location && (
                    <p className="text-muted-foreground">{profile.location}</p>
                  )}
                </div>
              </div>
              {profile.bio && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-muted-foreground">
                Profile not found
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;