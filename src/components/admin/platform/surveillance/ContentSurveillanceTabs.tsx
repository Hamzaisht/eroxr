
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentSurveillance } from "./hooks/useContentSurveillance";
import { ContentSurveillanceList } from "./components/ContentSurveillanceList";
import { SurveillanceContentItem, ContentType } from "./types";

interface ContentSurveillanceListProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  onViewContent: (content: SurveillanceContentItem) => void;
  emptyMessage?: string;
  error?: any;
  title?: string;
}

export const ContentSurveillanceTabs = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('posts');
  const { 
    posts, 
    stories, 
    videos, 
    audios, 
    isLoading
  } = useContentSurveillance();
  
  // Define placeholder functions if they don't exist in useContentSurveillance
  const handleViewContentDetails = (content: SurveillanceContentItem) => {
    console.log("View content details:", content);
    // Implement actual functionality here if needed
  };
  
  return (
    <Tabs 
      defaultValue="posts" 
      onValueChange={(value) => setActiveTab(value as ContentType)}
      className="w-full"
    >
      <TabsList className="mb-4 bg-slate-800/80 backdrop-blur-lg">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="stories">Stories</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="audios">Audio</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts">
        <ContentSurveillanceList 
          items={posts}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No posts found for surveillance"
          title="Recent Posts"
        />
      </TabsContent>
      
      <TabsContent value="stories">
        <ContentSurveillanceList 
          items={stories}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No stories found for surveillance"
          title="Recent Stories"
        />
      </TabsContent>
      
      <TabsContent value="videos">
        <ContentSurveillanceList 
          items={videos}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No videos found for surveillance"
          title="Recent Videos"
        />
      </TabsContent>
      
      <TabsContent value="audios">
        <ContentSurveillanceList 
          items={audios}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No audio content found for surveillance"
          title="Recent Audio Content"
        />
      </TabsContent>
    </Tabs>
  );
};
