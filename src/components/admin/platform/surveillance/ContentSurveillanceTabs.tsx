
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SurveillanceContentItem, ContentType } from "@/types/surveillance";
import { ContentSurveillanceList } from "./components/ContentSurveillanceList";

export function ContentSurveillanceTabs() {
  const [activeTab, setActiveTab] = useState<string>('image');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for different content types
  const mockImageItems: SurveillanceContentItem[] = [
    {
      id: "img-123",
      title: "Sample Image",
      description: "A sample image upload",
      content_type: "image",
      type: "image",
      user_id: "user-123",
      creator_id: "user-123", // Fixed property
      creator_username: "imagecreator",
      creator_avatar: "https://i.pravatar.cc/150?u=img1",
      created_at: new Date().toISOString(),
      flagged: false,
      media_url: ["https://picsum.photos/seed/img1/800/600"],
      severity: "medium",
      status: "pending",
      visibility: "public"
    },
    {
      id: "img-456",
      title: "Flagged Image",
      description: "An image that was flagged",
      content_type: "image",
      type: "image",
      user_id: "user-456",
      creator_id: "user-456", // Fixed property
      creator_username: "problematicuser",
      creator_avatar: "https://i.pravatar.cc/150?u=img2",
      created_at: new Date().toISOString(),
      flagged: true,
      reason: "Inappropriate content",
      media_url: ["https://picsum.photos/seed/img2/800/600"],
      severity: "high",
      status: "reviewed",
      visibility: "public"
    }
  ];
  
  const mockVideoItems: SurveillanceContentItem[] = [
    {
      id: "vid-123",
      title: "Sample Video",
      description: "A sample video upload",
      content_type: "video",
      type: "video",
      user_id: "user-789",
      creator_id: "user-789", // Fixed property
      creator_username: "videocreator",
      creator_avatar: "https://i.pravatar.cc/150?u=vid1",
      created_at: new Date().toISOString(),
      flagged: false,
      video_url: "https://example.com/video.mp4",
      media_url: ["https://picsum.photos/seed/vid1/800/600"],
      severity: "low",
      status: "pending",
      visibility: "public"
    }
  ];
  
  const mockTextItems: SurveillanceContentItem[] = [
    {
      id: "txt-123",
      title: "Sample Text Post",
      description: "This is a text post with some sample content for moderation.",
      content_type: "text",
      type: "text",
      user_id: "user-101",
      creator_id: "user-101", // Fixed property
      creator_username: "writer",
      creator_avatar: "https://i.pravatar.cc/150?u=txt1",
      created_at: new Date().toISOString(),
      flagged: false,
      media_url: [],
      severity: "low",
      status: "pending",
      visibility: "public"
    }
  ];
  
  const mockAudioItems: SurveillanceContentItem[] = [
    {
      id: "aud-123",
      title: "Sample Audio",
      description: "A sample audio recording",
      content_type: "audio",
      type: "audio",
      user_id: "user-202",
      creator_id: "user-202", // Fixed property
      creator_username: "podcaster",
      creator_avatar: "https://i.pravatar.cc/150?u=aud1",
      created_at: new Date().toISOString(),
      flagged: false,
      media_url: ["https://example.com/audio.mp3"],
      severity: "medium",
      status: "pending",
      visibility: "public"
    }
  ];
  
  // Get content items based on active tab
  const getContentItems = () => {
    switch (activeTab) {
      case 'image':
        return mockImageItems;
      case 'video':
        return mockVideoItems;
      case 'text':
        return mockTextItems;
      case 'audio':
        return mockAudioItems;
      default:
        return [];
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Content Surveillance</h2>
        <TabsList>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="text">Text Posts</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="image">
        <ContentSurveillanceList 
          items={mockImageItems} 
          isLoading={isLoading} 
          contentType="image"
        />
      </TabsContent>
      
      <TabsContent value="video">
        <ContentSurveillanceList 
          items={mockVideoItems} 
          isLoading={isLoading} 
          contentType="video"
        />
      </TabsContent>
      
      <TabsContent value="text">
        <ContentSurveillanceList 
          items={mockTextItems} 
          isLoading={isLoading} 
          contentType="text"
        />
      </TabsContent>
      
      <TabsContent value="audio">
        <ContentSurveillanceList 
          items={mockAudioItems} 
          isLoading={isLoading} 
          contentType="audio"
        />
      </TabsContent>
    </Tabs>
  );
}
