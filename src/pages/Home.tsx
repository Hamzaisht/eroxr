
import { useState } from "react";
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeedHeader } from "@/components/home/FeedHeader";
import { FeedContent } from "@/components/home/feed/FeedContent";
import { StoryReel } from "@/components/StoryReel";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";

export type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');
  const createPostDialog = useCreatePostDialog();
  const goLiveDialog = useGoLiveDialog();

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedContent />;
      case 'popular':
        return <CreatorsFeed feedType="popular" />;
      case 'recent':
        return <CreatorsFeed feedType="recent" />;
      case 'shorts':
        return <CreatorsFeed feedType="feed" />;
      default:
        return <FeedContent />;
    }
  };

  return (
    <HomeLayout>
      <div className="space-y-6">
        {/* Stories Section */}
        <div className="w-full">
          <StoryReel />
        </div>
        
        {/* Create Post Area */}
        <CreatePostArea 
          onCreatePost={createPostDialog.openDialog}
          onGoLive={goLiveDialog.openDialog}
        />
        
        {/* Feed Header with Tabs */}
        <FeedHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {/* Dynamic Content Based on Active Tab */}
        <div className="w-full">
          {renderContent()}
        </div>
      </div>

      {/* Dialogs */}
      <CreatePostDialog 
        open={createPostDialog.isOpen}
        onOpenChange={createPostDialog.closeDialog}
      />
      
      <GoLiveDialog 
        open={goLiveDialog.isOpen}
        onOpenChange={goLiveDialog.closeDialog}
      />
    </HomeLayout>
  );
};

export default Home;
