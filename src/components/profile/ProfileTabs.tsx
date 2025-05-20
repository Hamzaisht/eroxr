
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ProfileTabsProps {
  profile: any; // This should ideally be properly typed
}

export const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('posts');
  
  return (
    <Tabs defaultValue="posts" className="w-full mt-6">
      <TabsList className="bg-luxury-darker/50 border-b border-luxury-primary/10 w-full flex justify-start rounded-none p-0">
        <TabsTrigger 
          value="posts" 
          className="py-3 px-6 data-[state=active]:bg-luxury-primary/10 data-[state=active]:text-luxury-primary border-b-2 border-transparent data-[state=active]:border-luxury-primary rounded-none"
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </TabsTrigger>
        <TabsTrigger 
          value="videos" 
          className="py-3 px-6 data-[state=active]:bg-luxury-primary/10 data-[state=active]:text-luxury-primary border-b-2 border-transparent data-[state=active]:border-luxury-primary rounded-none"
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </TabsTrigger>
        <TabsTrigger 
          value="about" 
          className="py-3 px-6 data-[state=active]:bg-luxury-primary/10 data-[state=active]:text-luxury-primary border-b-2 border-transparent data-[state=active]:border-luxury-primary rounded-none"
          onClick={() => setActiveTab('about')}
        >
          About
        </TabsTrigger>
        <TabsTrigger 
          value="reviews" 
          className="py-3 px-6 data-[state=active]:bg-luxury-primary/10 data-[state=active]:text-luxury-primary border-b-2 border-transparent data-[state=active]:border-luxury-primary rounded-none"
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="mt-4">
        <div className="bg-luxury-darker/30 rounded-lg p-8 text-center">
          <h3 className="text-luxury-primary text-lg">Posts</h3>
          <p className="text-luxury-neutral/70 mt-2">
            {profile?.posts?.length 
              ? `${profile.username} has ${profile.posts.length} posts` 
              : `${profile?.username || 'User'} hasn't posted anything yet.`}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="videos" className="mt-4">
        <div className="bg-luxury-darker/30 rounded-lg p-8 text-center">
          <h3 className="text-luxury-primary text-lg">Videos</h3>
          <p className="text-luxury-neutral/70 mt-2">
            {profile?.videos?.length 
              ? `${profile.username} has ${profile.videos.length} videos` 
              : `${profile?.username || 'User'} hasn't uploaded any videos yet.`}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="about" className="mt-4">
        <div className="bg-luxury-darker/30 rounded-lg p-8">
          <h3 className="text-luxury-primary text-lg">About {profile?.username || 'User'}</h3>
          <p className="text-luxury-neutral/70 mt-2">
            {profile?.bio || 'No information available.'}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-4">
        <div className="bg-luxury-darker/30 rounded-lg p-8 text-center">
          <h3 className="text-luxury-primary text-lg">Reviews</h3>
          <p className="text-luxury-neutral/70 mt-2">
            No reviews yet.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
