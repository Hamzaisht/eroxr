
import { useState } from "react";
import { HomeLayout } from "@/components/home/HomeLayout";
import { FeedHeader } from "@/components/home/FeedHeader";
import { FeedContent } from "@/components/home/feed/FeedContent";
import { StoryReel } from "@/components/StoryReel";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');
  const [showWelcome, setShowWelcome] = useState(true);
  const createPostDialog = useCreatePostDialog();
  const goLiveDialog = useGoLiveDialog();
  const { user, profile } = useCurrentUser();

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

  const getUserDisplayName = () => {
    if (!user) return undefined;
    if (profile?.username) return `@${profile.username}`;
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <HomeLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        {showWelcome && (
          <WelcomeBanner 
            username={getUserDisplayName()}
            onDismiss={() => setShowWelcome(false)}
          />
        )}
        
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
