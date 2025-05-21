
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useInView } from "react-intersection-observer";
import { StickyHeader } from "./StickyHeader";
import { useContentTabs } from "./DatingContent/useContentTabs";
import { useProfileInteractions } from "./hooks/useProfileInteractions";
import { useScrollPosition } from "./hooks/useScrollPosition";
import { DatingContentTabs } from "./DatingContentTabs/TabsContent";
import { DatingAd } from "@/components/ads/types/dating";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { ref: tabsRef, inView: tabsInView } = useInView({
    threshold: 0,
    rootMargin: "-50px 0px 0px 0px"
  });

  const {
    viewMode, setViewMode, browseSubTab, setBrowseSubTab, selectedAd, setSelectedAd,
    mostViewedAds, trendingAds
  } = useContentTabs(ads);

  const { handleLike, handleSkip, handleMessage } = useProfileInteractions();
  const { scrollPosition, restoreScroll } = useScrollPosition();

  // Utility to apply tag click logic on ads
  const makeTagClickable = (adItems: DatingAd[] = []) => {
    if (!adItems || !onTagClick) return adItems;
    return adItems.map((ad) => ({
      ...ad,
      tags: ad.tags?.map((tag: string) => tag) || [],
      onTagClick
    }));
  };

  // Restore scroll
  useEffect(() => {
    return restoreScroll(scrollPosition);
  }, [viewMode, browseSubTab, scrollPosition, activeTab]);

  // Floating tabs when scrolled past header
  const [showFloatingTabs, setShowFloatingTabs] = useState(false);
  useEffect(() => {
    setShowFloatingTabs(!tabsInView);
  }, [tabsInView]);

  // Handle tab changes and sync with parent if needed
  const handleTabChange = (value: string) => {
    if (onTabChange) onTabChange(value);
  };

  // Handle profile actions with the hook functions
  const handleProfileLike = () => handleLike(selectedAd);
  const handleProfileSkip = () => setSelectedAd(handleSkip());
  const handleProfileMessage = () => handleMessage(selectedAd);

  // Render tabs
  return (
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
        ads={ads}
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
  );
}
