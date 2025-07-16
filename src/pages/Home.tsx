
import { useState, useEffect } from "react";
import { HomeLayout } from "@/components/home/HomeLayout";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
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
import { useUserRole } from "@/hooks/useUserRole";
import { assignCurrentUserAsSuperAdmin } from "@/utils/assignSuperAdmin";

export type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');
  const [showWelcome, setShowWelcome] = useState(true);
  const createPostDialog = useCreatePostDialog();
  const goLiveDialog = useGoLiveDialog();
  const { user, profile, isLoading } = useCurrentUser();
  const { hasPremium, isLoading: subscriptionLoading } = usePlatformSubscription();
  const { isSuperAdmin, role } = useUserRole();

  // Auto-assign super admin role on first load for the main user (only once per session)
  useEffect(() => {
    const hasAssigned = sessionStorage.getItem('super_admin_assigned');
    
    const autoAssignSuperAdmin = async () => {
      if (user && !isSuperAdmin && role === 'user' && !hasAssigned) {
        try {
          console.log('🔄 Auto-assigning super admin role...');
          sessionStorage.setItem('super_admin_assigned', 'true');
          const success = await assignCurrentUserAsSuperAdmin();
          if (success) {
            // Force refetch instead of page reload
            window.location.href = '/home';
          }
        } catch (error) {
          console.error('Failed to assign super admin:', error);
          sessionStorage.removeItem('super_admin_assigned');
        }
      }
    };

    if (user && role && !hasAssigned) {
      autoAssignSuperAdmin();
    }
  }, [user?.id, role, isSuperAdmin]); // Include all necessary dependencies

  // Removed excessive console logging to prevent re-render issues

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-white mb-4">Please sign in to view content</p>
        </div>
      );
    }

    // Show content with super admin having full access
    const hasFullAccess = hasPremium || isSuperAdmin;
    switch (activeTab) {
      case 'feed':
        return <FeedContent isFreemium={!hasFullAccess} />;
      case 'popular':
        return <CreatorsFeed feedType="popular" isFreemium={!hasFullAccess} />;
      case 'recent':
        return <CreatorsFeed feedType="recent" isFreemium={!hasFullAccess} />;
      case 'shorts':
        return <CreatorsFeed feedType="feed" isFreemium={!hasFullAccess} />;
      default:
        return <FeedContent isFreemium={!hasFullAccess} />;
    }
  };

  const getUserDisplayName = () => {
    if (isLoading) return "Loading...";
    if (!user) return undefined;
    if (isSuperAdmin) return `👑 ${profile?.username ? `@${profile.username}` : 'Super Admin'}`;
    if (profile?.username) return `@${profile.username}`;
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <>
      <InteractiveNav />
      <HomeLayout>
        <div className="md:ml-20 space-y-6">
        {/* Welcome Banner */}
        {showWelcome && (
          <WelcomeBanner 
            username={getUserDisplayName()}
            onDismiss={() => setShowWelcome(false)}
          />
        )}
        
        {/* Stories Section - Always visible */}
        <div className="w-full">
          <StoryReel />
        </div>
        
        {/* Create Post Area - Show for all users with upgrade prompt for free users */}
        {hasPremium || isSuperAdmin ? (
          <CreatePostArea 
            onCreatePost={createPostDialog.openDialog}
            onGoLive={goLiveDialog.openDialog}
          />
        ) : (
          <FreemiumTeaser contentType="upload" className="w-full">
            <CreatePostArea 
              onCreatePost={createPostDialog.openDialog}
              onGoLive={goLiveDialog.openDialog}
            />
          </FreemiumTeaser>
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
    </>
  );
};

export default Home;
