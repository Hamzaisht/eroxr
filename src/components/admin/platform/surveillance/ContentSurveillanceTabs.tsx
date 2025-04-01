
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw, Music } from "lucide-react";
import { ContentSurveillanceList } from "./components/ContentSurveillanceList";
import { ContentType, SurveillanceContentItem } from "./types";
import { useContentSurveillance } from "./hooks/useContentSurveillance";
import { useSurveillance } from "./SurveillanceContext";
import { Badge } from "@/components/ui/badge";
import { ContentDetailDialog } from "./components/ContentDetailDialog";

export const ContentSurveillanceTabs = () => {
  const { isRefreshing, handleRefresh } = useSurveillance();
  const [activeTab, setActiveTab] = useState<ContentType>('post');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SurveillanceContentItem | null>(null);
  const [visibility, setVisibility] = useState<string>("all");
  
  const { 
    posts, 
    stories, 
    videos, 
    ppvContent,
    audioContent,
    isLoading,
    error,
    fetchContentByType
  } = useContentSurveillance();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as ContentType);
    fetchContentByType(value as ContentType);
  };

  const handleViewContent = (content: SurveillanceContentItem) => {
    setSelectedContent(content);
    setShowDetailDialog(true);
  };

  const getFilteredContent = (items: SurveillanceContentItem[]) => {
    if (visibility === "all") return items;
    if (visibility === "public") return items.filter(item => item.visibility === "public" && !item.is_ppv);
    if (visibility === "private") return items.filter(item => item.visibility === "private" || item.visibility === "subscribers_only");
    if (visibility === "ppv") return items.filter(item => item.is_ppv);
    if (visibility === "draft") return items.filter(item => item.is_draft);
    if (visibility === "deleted") return items.filter(item => item.is_deleted);
    return items;
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'post': return getFilteredContent(posts);
      case 'story': return getFilteredContent(stories);
      case 'video': return getFilteredContent(videos);
      case 'ppv': return getFilteredContent(ppvContent);
      case 'audio': return getFilteredContent(audioContent);
      default: return [];
    }
  };

  const getItemCount = (type: ContentType) => {
    switch (type) {
      case 'post': return posts.length;
      case 'story': return stories.length;
      case 'video': return videos.length;
      case 'ppv': return ppvContent.length;
      case 'audio': return audioContent.length;
      default: return 0;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-xl font-semibold">Ghost Mode Content Surveillance</h2>
        
        <div className="flex items-center gap-2">
          <Select
            value={visibility}
            onValueChange={setVisibility}
          >
            <SelectTrigger className="w-[180px] bg-[#161B22]/80">
              <SelectValue placeholder="Filter by visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private/Subscriber</SelectItem>
              <SelectItem value="ppv">PPV Locked</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-4 bg-[#161B22]/80 backdrop-blur-md">
          <TabsTrigger value="post" className="relative">
            Posts
            <Badge variant="outline" className="ml-1.5 text-xs">
              {getItemCount('post')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="story" className="relative">
            Stories
            <Badge variant="outline" className="ml-1.5 text-xs">
              {getItemCount('story')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="video" className="relative">
            Videos
            <Badge variant="outline" className="ml-1.5 text-xs">
              {getItemCount('video')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ppv" className="relative">
            PPV Content
            <Badge variant="outline" className="ml-1.5 text-xs">
              {getItemCount('ppv')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="audio" className="relative">
            Audio
            <Badge variant="outline" className="ml-1.5 text-xs">
              {getItemCount('audio')}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="post">
          <ContentSurveillanceList
            items={getCurrentItems()}
            isLoading={isLoading}
            error={error}
            type="post"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="story">
          <ContentSurveillanceList
            items={getCurrentItems()}
            isLoading={isLoading}
            error={error}
            type="story"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="video">
          <ContentSurveillanceList
            items={getCurrentItems()}
            isLoading={isLoading}
            error={error}
            type="video"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="ppv">
          <ContentSurveillanceList
            items={getCurrentItems()}
            isLoading={isLoading}
            error={error}
            type="ppv"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="audio">
          <ContentSurveillanceList
            items={getCurrentItems()}
            isLoading={isLoading}
            error={error}
            type="audio"
            onViewContent={handleViewContent}
          />
        </TabsContent>
      </Tabs>

      {selectedContent && (
        <ContentDetailDialog
          content={selectedContent}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </div>
  );
};
