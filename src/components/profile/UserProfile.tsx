
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { ProfilePosts } from "./ProfilePosts";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShortsList } from "./ShortsList";

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSession();
  const [activeTab, setActiveTab] = useState("posts");
  
  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Update the tab based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'shorts' || hash === 'posts' || hash === 'about') {
      setActiveTab(hash);
    }
  }, []);

  // Update the URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  if (!id) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-luxury-dark">
      <ProfileHeader 
        profile={profile} 
        isCurrentUser={session?.user?.id === id}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="min-h-[400px]">
            <ProfilePosts userId={id} />
          </TabsContent>
          
          <TabsContent value="shorts" className="min-h-[400px]">
            <ShortsList />
          </TabsContent>
          
          <TabsContent value="about" className="min-h-[400px]">
            <div className="bg-luxury-darker rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">About {profile?.username}</h3>
              <p className="text-luxury-neutral">
                {profile?.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
