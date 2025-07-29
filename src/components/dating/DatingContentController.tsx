import { useState, useEffect, useMemo } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useInView } from "react-intersection-observer";
import { StickyHeader } from "./StickyHeader";
import { useContentTabs } from "./DatingContent/useContentTabs";
import { useProfileInteractions } from "./hooks/useProfileInteractions";
import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";
import { DatingContentTabs } from "./DatingContentTabs/TabsContent";
import { MobileOptimizedGrid } from "./enhanced/MobileOptimizedGrid";
import { SwipeController } from "./enhanced/SwipeController";
import { OptimizedScrollContainer } from "./enhanced/OptimizedScrollContainer";
import { DatingAd } from "@/components/ads/types/dating";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DatingContentControllerProps {
  ads: DatingAd[];
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  onTagClick: (tag: string) => void;
  isLoading?: boolean;
  userProfile: DatingAd | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onFilterToggle?: () => void;
}

export function DatingContentController({ 
  ads = [],
  canAccessBodyContact,
  onAdCreationSuccess,
  onTagClick,
  isLoading = false,
  userProfile,
  activeTab = "browse",
  onTabChange,
  onFilterToggle
}: DatingContentControllerProps) {
  const session = useSession();
  const isMobile = useIsMobile();
  const { ref: tabsRef, inView: tabsInView } = useInView({
    threshold: 0,
    rootMargin: "-50px 0px 0px 0px"
  });

  const {
    viewMode, 
    setViewMode, 
    browseSubTab, 
    setBrowseSubTab, 
    selectedAd, 
    setSelectedAd,
    mostViewedAds, 
    trendingAds
  } = useContentTabs(ads);

  const { handleLike, handleSkip, handleMessage } = useProfileInteractions();
  const { scrollPosition, scrollToTop } = useOptimizedScroll({
    threshold: 100,
    enablePullToRefresh: true,
    onRefresh: () => {
      // Trigger data refresh
      onAdCreationSuccess();
    }
  });

  // Floating tabs when scrolled past header
  const [showFloatingTabs, setShowFloatingTabs] = useState(false);
  useEffect(() => {
    setShowFloatingTabs(!tabsInView);
  }, [tabsInView]);

  // Handle tab changes and sync with parent if needed
  const handleTabChange = (value: string) => {
    if (onTabChange) onTabChange(value);
    // Scroll to top on tab change for better UX
    scrollToTop();
  };

  // Handle profile actions with the hook functions
  const handleProfileLike = () => handleLike(selectedAd);
  const handleProfileSkip = () => setSelectedAd(handleSkip());
  const handleProfileMessage = () => handleMessage(selectedAd);

  // Utility to apply tag click logic on ads
  const makeTagClickable = (adItems: DatingAd[] = []) => {
    if (!adItems || !onTagClick) return adItems;
    return adItems.map((ad) => ({
      ...ad,
      tags: ad.tags?.map((tag: string) => tag) || [],
      onTagClick
    }));
  };

  // Memoize processed ads for performance
  const processedAds = useMemo(() => makeTagClickable(ads), [ads, onTagClick]);

  // Handle mobile grid refresh
  const handleRefresh = async () => {
    onAdCreationSuccess();
  };

  // Handle infinite scroll load more
  const handleLoadMore = () => {
    // This would typically trigger loading more data
    console.log('Loading more ads...');
  };

  // Mobile-optimized rendering for grid view
  if (isMobile && viewMode === 'grid') {
    return (
      <SwipeController
        className="h-full"
        onSwipeLeft={() => {
          // Quick navigation - could switch tabs
          console.log('Swiped left - quick navigation');
        }}
        onSwipeRight={() => {
          // Quick action
          console.log('Swiped right - quick action');
        }}
      >
        <div ref={tabsRef} className="flex-1 h-full">
          {/* Floating header for sticky tabs/navigation */}
          {showFloatingTabs && (
            <StickyHeader 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              onFilterToggle={onFilterToggle}
            />
          )}
          
          <MobileOptimizedGrid
            ads={processedAds}
            isLoading={isLoading}
            hasMore={true}
            userProfile={userProfile}
            onLoadMore={handleLoadMore}
            onRefresh={handleRefresh}
            onAdSelect={setSelectedAd}
            className="h-full"
          />
        </div>
      </SwipeController>
    );
  }

  // Desktop and list view rendering
  return (
    <OptimizedScrollContainer
      className="h-full"
      onScrollEnd={handleLoadMore}
      onRefresh={handleRefresh}
      enablePullToRefresh={isMobile}
      isLoading={isLoading}
      hasMore={true}
    >
      <div ref={tabsRef} className="flex-1 space-y-6">
        {/* Floating header for sticky tabs/navigation */}
        {showFloatingTabs && (
          <StickyHeader 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onFilterToggle={onFilterToggle}
          />
        )}
        
        {/* Tabs Content */}
        <DatingContentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          ads={processedAds}
          isLoading={isLoading}
          userProfile={userProfile}
          session={session}
          viewMode={viewMode}
          makeTagClickable={makeTagClickable}
          selectedAd={selectedAd}
          setSelectedAd={setSelectedAd}
          browseSubTab={browseSubTab}
          setBrowseSubTab={setBrowseSubTab}
          mostViewedAds={mostViewedAds || []}
          trendingAds={trendingAds || []}
          canAccessBodyContact={canAccessBodyContact}
          onAdCreationSuccess={onAdCreationSuccess}
        />
      </div>
    </OptimizedScrollContainer>
  );
}