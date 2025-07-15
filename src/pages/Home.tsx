
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
import { FreemiumTeaser } from "@/components/subscription/FreemiumTeaser";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";

export type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');
  const [showWelcome, setShowWelcome] = useState(true);
  const createPostDialog = useCreatePostDialog();
  const goLiveDialog = useGoLiveDialog();
  const { user, profile, isLoading } = useCurrentUser();
  const { hasPremium, isLoading: subscriptionLoading } = usePlatformSubscription();

  console.log("🏠 Home - Render state:", {
    activeTab,
    showWelcome,
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    hasPremium,
    subscriptionLoading
  });

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-white mb-4">Please sign in to view content</p>
        </div>
      );
    }

    // Always show content but pass premium status to components
    switch (activeTab) {
      case 'feed':
        return <FeedContent isFreemium={!hasPremium} />;
      case 'popular':
        return <CreatorsFeed feedType="popular" isFreemium={!hasPremium} />;
      case 'recent':
        return <CreatorsFeed feedType="recent" isFreemium={!hasPremium} />;
      case 'shorts':
        return <CreatorsFeed feedType="feed" isFreemium={!hasPremium} />;
      default:
        return <FeedContent isFreemium={!hasPremium} />;
    }
  };

  const getUserDisplayName = () => {
    if (isLoading) return "Loading...";
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
          {hasPremium ? (
            <StoryReel />
          ) : (
            <FreemiumTeaser contentType="media" className="h-24">
              <StoryReel />
            </FreemiumTeaser>
          )}
        </div>
        
        {/* Create Post Area - Only show for premium users */}
        {hasPremium && (
          <CreatePostArea 
            onCreatePost={createPostDialog.openDialog}
            onGoLive={goLiveDialog.openDialog}
          />
        )}
        
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
