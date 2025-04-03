
import { useEffect, useState } from "react";
import { useContentSurveillance } from "./hooks/useContentSurveillance";
import { ContentSurveillanceList } from "./components/ContentSurveillanceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentDetailDialog } from "./components/ContentDetailDialog";
import { SurveillanceContentItem, ContentType } from "./types";
import { Badge } from "@/components/ui/badge";

// Create a wrapper component that contains our props
interface ContentSurveillanceListWrapperProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  title: string;
  onViewDetails: (content: SurveillanceContentItem) => void;
  emptyMessage: string;
  error: any;
}

const ContentSurveillanceListWrapper = ({
  items,
  isLoading,
  title,
  onViewDetails,
  emptyMessage,
  error
}: ContentSurveillanceListWrapperProps) => {
  return (
    <ContentSurveillanceList 
      items={items}
      isLoading={isLoading}
      title={title}
      onViewDetails={onViewDetails}
      emptyMessage={emptyMessage}
      error={error}
    />
  );
};

export function ContentSurveillanceTabs() {
  const [activeTab, setActiveTab] = useState<ContentType>('posts');
  const [selectedContent, setSelectedContent] = useState<SurveillanceContentItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const {
    posts,
    stories,
    videos,
    audios,
    isLoading,
    fetchAllContent,
    fetchContentByType
  } = useContentSurveillance();
  
  const error = null; // Add error state if needed
  
  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as ContentType);
    fetchContentByType(value as ContentType);
  };
  
  const handleViewDetails = (content: SurveillanceContentItem) => {
    setSelectedContent(content);
    setDetailDialogOpen(true);
  };
  
  // Filter helpers
  const allPpvContent = [
    ...posts.filter(post => post.is_ppv),
    ...videos.filter(video => video.is_ppv),
    ...stories.filter(story => story.is_ppv)
  ];
  
  const allHiddenContent = [
    ...posts.filter(post => post.visibility === 'private' || post.is_ppv),
    ...videos.filter(video => video.visibility === 'private' || video.visibility === 'unlisted'),
    ...stories.filter(story => story.is_ppv),
    ...audios.filter(audio => audio.is_draft || audio.is_deleted)
  ];
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="posts" onValueChange={handleTabChange}>
        <TabsList className="w-full grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8">
          <TabsTrigger value="posts" className="relative">
            Posts
            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
              {posts.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="stories" className="relative">
            Stories
            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
              {stories.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="videos" className="relative">
            Videos
            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
              {videos.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="audios" className="relative">
            Audio
            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
              {audios.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="ppv" className="relative">
            PPV
            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
              {allPpvContent.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="hidden" className="relative">
            Hidden
            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
              {allHiddenContent.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <ContentSurveillanceListWrapper 
            items={posts}
            isLoading={isLoading}
            title="Recent Posts"
            onViewDetails={handleViewDetails}
            emptyMessage="No posts found"
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="stories">
          <ContentSurveillanceListWrapper 
            items={stories}
            isLoading={isLoading}
            title="Active Stories"
            onViewDetails={handleViewDetails}
            emptyMessage="No stories found"
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="videos">
          <ContentSurveillanceListWrapper
            items={videos}
            isLoading={isLoading}
            title="Recent Videos"
            onViewDetails={handleViewDetails}
            emptyMessage="No videos found" 
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="audios">
          <ContentSurveillanceListWrapper
            items={audios}
            isLoading={isLoading}
            title="Audio Content"
            onViewDetails={handleViewDetails}
            emptyMessage="No audio content found"
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="ppv">
          <ContentSurveillanceListWrapper
            items={allPpvContent}
            isLoading={isLoading}
            title="Pay-Per-View Content"
            onViewDetails={handleViewDetails}
            emptyMessage="No pay-per-view content found"
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="hidden">
          <ContentSurveillanceListWrapper
            items={allHiddenContent}
            isLoading={isLoading}
            title="Hidden Content"
            onViewDetails={handleViewDetails}
            emptyMessage="No hidden content found"
            error={error}
          />
        </TabsContent>
      </Tabs>
      
      {selectedContent && (
        <ContentDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          session={selectedContent}
        />
      )}
    </div>
  );
}
