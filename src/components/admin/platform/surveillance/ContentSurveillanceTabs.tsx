
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentSurveillance } from "./hooks/useContentSurveillance";
import { ContentSurveillanceList } from "./components/ContentSurveillanceList";
import { SurveillanceContentItem, ContentType } from "@/types/surveillance";

interface ContentSurveillanceListProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  onViewContent: (content: SurveillanceContentItem) => void;
  emptyMessage?: string;
  error?: any;
  title?: string;
}

export const ContentSurveillanceTabs = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('post');
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
      defaultValue="post" 
      onValueChange={(value) => setActiveTab(value as ContentType)}
      className="w-full"
    >
      <TabsList className="mb-4 bg-slate-800/80 backdrop-blur-lg">
        <TabsTrigger value="post">Posts</TabsTrigger>
        <TabsTrigger value="story">Stories</TabsTrigger>
        <TabsTrigger value="video">Videos</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
      </TabsList>
      
      <TabsContent value="post">
        <ContentSurveillanceList 
          items={posts}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No posts found for surveillance"
          title="Recent Posts"
        />
      </TabsContent>
      
      <TabsContent value="story">
        <ContentSurveillanceList 
          items={stories}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No stories found for surveillance"
          title="Recent Stories"
        />
      </TabsContent>
      
      <TabsContent value="video">
        <ContentSurveillanceList 
          items={videos}
          isLoading={isLoading}
          onViewContent={handleViewContentDetails}
          emptyMessage="No videos found for surveillance"
          title="Recent Videos"
        />
      </TabsContent>
      
      <TabsContent value="audio">
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
