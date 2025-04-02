
import { useState, useEffect } from "react";
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
import { SearchFilterBar, SearchFilter } from "./components/SearchFilterBar";

export const ContentSurveillanceTabs = () => {
  const { isRefreshing, handleRefresh } = useSurveillance();
  const [activeTab, setActiveTab] = useState<ContentType>('post');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SurveillanceContentItem | null>(null);
  const [visibility, setVisibility] = useState<string>("all");
  const [filteredContent, setFilteredContent] = useState<SurveillanceContentItem[]>([]);
  
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
  
  // Update filtered content when visibility or current items change
  useEffect(() => {
    setFilteredContent(getCurrentItems());
  }, [visibility, posts, stories, videos, ppvContent, audioContent, activeTab]);
  
  // Handle search and filtering
  const handleSearch = (filters: SearchFilter) => {
    const items = getCurrentItems();
    
    const filtered = items.filter(item => {
      // Filter by username/creator username
      if (filters.username && 
         !(item.creator_username?.toLowerCase().includes(filters.username.toLowerCase()) || 
           item.username?.toLowerCase().includes(filters.username.toLowerCase()))) {
        return false;
      }
      
      // Filter by user ID/creator ID
      if (filters.userId && 
         !(item.creator_id === filters.userId || item.user_id === filters.userId)) {
        return false;
      }
      
      // Filter by status (draft, deleted, etc)
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'draft' && !item.is_draft) return false;
        if (filters.status === 'deleted' && !item.is_deleted) return false;
        if (filters.status === 'flagged' && !item.is_flagged) return false;
      }
      
      // Filter by content type
      if (filters.type && filters.type !== 'all' && item.content_type !== filters.type) {
        return false;
      }
      
      return true;
    });
    
    setFilteredContent(filtered);
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
      
      <SearchFilterBar 
        onSearch={handleSearch}
        placeholder="Search content by username or creator ID..."
        availableTypes={[
          { value: 'all', label: 'All Types' },
          { value: 'photo', label: 'Photo' },
          { value: 'video', label: 'Video' },
          { value: 'text', label: 'Text Only' },
          { value: 'audio', label: 'Audio' }
        ]}
        availableStatuses={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
          { value: 'deleted', label: 'Deleted' },
          { value: 'flagged', label: 'Flagged' }
        ]}
      />
      
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
            items={filteredContent}
            isLoading={isLoading}
            error={error}
            type="post"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="story">
          <ContentSurveillanceList
            items={filteredContent}
            isLoading={isLoading}
            error={error}
            type="story"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="video">
          <ContentSurveillanceList
            items={filteredContent}
            isLoading={isLoading}
            error={error}
            type="video"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="ppv">
          <ContentSurveillanceList
            items={filteredContent}
            isLoading={isLoading}
            error={error}
            type="ppv"
            onViewContent={handleViewContent}
          />
        </TabsContent>
        
        <TabsContent value="audio">
          <ContentSurveillanceList
            items={filteredContent}
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
