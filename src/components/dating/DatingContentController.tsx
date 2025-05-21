
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { StickyHeader } from "./StickyHeader";
import { useContentTabs } from "./DatingContent/useContentTabs";
import { AllAdsTab } from "./DatingContentTabs/AllAdsTab";
import { TrendingAdsTab } from "./DatingContentTabs/TrendingAdsTab";
import { PopularAdsTab } from "./DatingContentTabs/PopularAdsTab";
import { QuickMatchTab } from "./DatingContentTabs/QuickMatchTab";
import { FavoritesTab } from "./DatingContentTabs/FavoritesTab";
import { NearbyTab } from "./DatingContentTabs/NearbyTab";

export function DatingContentController({ 
  ads,
  canAccessBodyContact,
  onAdCreationSuccess,
  onTagClick,
  isLoading = false,
  userProfile,
  activeTab = "browse",
  onTabChange,
  onFilterToggle
}: any) {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [scrollPosition, setScrollPosition] = useState(0);
  const { ref: tabsRef, inView: tabsInView } = useInView({
    threshold: 0,
    rootMargin: "-50px 0px 0px 0px"
  });

  const {
    viewMode, setViewMode, browseSubTab, setBrowseSubTab, selectedAd, setSelectedAd,
    mostViewedAds, trendingAds
  } = useContentTabs(ads);

  // Utility to apply tag click logic on ads (kept for use with All/Trending/Popular tabs)
  const makeTagClickable = (ads: any) => {
    if (!ads || !onTagClick) return ads;
    return ads.map((ad: any) => ({
      ...ad,
      tags: ad.tags?.map((tag: string) => tag) || [],
      onTagClick
    }));
  };

  // Handle events for profile interactions (moved from FloatingActionButton)
  const handleLike = () => {
    if (!selectedAd || !session) {
      toast({
        title: "Select a profile first",
        description: "You need to select a profile before you can like it",
        duration: 2000,
      });
      return;
    }
    toast({
      title: "Liked profile",
      description: `You've liked ${selectedAd.title}`,
      duration: 2000,
    });
  };

  const handleSkip = () => {
    setSelectedAd(null);
    toast({
      title: "Skipped profile",
      description: "Showing you different profiles",
      duration: 2000,
    });
  };

  const handleMessage = () => {
    if (!selectedAd || !session) {
      toast({
        title: "Select a profile first",
        description: "You need to select a profile before you can message them",
        duration: 2000,
      });
      return;
    }
    toast({
      title: "Message sent",
      description: `You've messaged ${selectedAd.title}`,
      duration: 2000,
    });
  };

  // Restore scroll
  useEffect(() => {
    const savedPosition = scrollPosition;
    const timer = setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, 100);

    return () => clearTimeout(timer);
  }, [viewMode, browseSubTab, scrollPosition, activeTab]);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating tabs when scrolled past header
  const [showFloatingTabs, setShowFloatingTabs] = useState(false);
  useEffect(() => {
    setShowFloatingTabs(!tabsInView);
  }, [tabsInView]);

  // Handle tab changes and sync with parent if needed
  const handleTabChange = (value: string) => {
    if (onTabChange) onTabChange(value);
  };

  // Render tabs
  return (
    <div className="flex-1 space-y-6">
      {/* Floating header for sticky tabs/navigation */}
      {showFloatingTabs && (
        <StickyHeader 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onFilterToggle={onFilterToggle}
        />
      )}
      
      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsContent value="browse">
          <AllAdsTab
            allAds={ads}
            isLoading={isLoading}
            userProfile={userProfile}
            setSelectedAd={setSelectedAd}
            selectedAd={selectedAd}
            session={session}
            viewMode={viewMode}
            makeTagClickable={makeTagClickable}
            onSelectProfile={setSelectedAd}
            browseSubTab={browseSubTab}
            setBrowseSubTab={setBrowseSubTab}
          />
        </TabsContent>
        <TabsContent value="trending">
          <TrendingAdsTab
            trendingAds={trendingAds}
            isLoading={isLoading}
            userProfile={userProfile}
            viewMode={viewMode}
            makeTagClickable={makeTagClickable}
          />
        </TabsContent>
        <TabsContent value="popular">
          <PopularAdsTab
            mostViewedAds={mostViewedAds}
            isLoading={isLoading}
            userProfile={userProfile}
            viewMode={viewMode}
            makeTagClickable={makeTagClickable}
          />
        </TabsContent>
        <TabsContent value="quick-match">
          <QuickMatchTab
            ads={ads}
            isLoading={isLoading}
            userProfile={userProfile}
            session={session}
            canAccessBodyContact={canAccessBodyContact}
            onAdCreationSuccess={onAdCreationSuccess}
          />
        </TabsContent>
        <TabsContent value="favorites">
          <FavoritesTab
            session={session}
            userProfile={userProfile}
          />
        </TabsContent>
        <TabsContent value="nearby">
          <NearbyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
