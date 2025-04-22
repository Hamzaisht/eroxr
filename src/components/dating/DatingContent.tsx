import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DatingAd } from "../ads/types/dating";
import { EmptyProfilesState } from "./EmptyProfilesState";
import { useSession } from "@supabase/auth-helpers-react";
import { TrendingUp, AlertCircle, Eye, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridViewMode, ListViewMode } from "@/components/ads/view-modes";
import { ViewModeToggle } from "@/components/ads/view-modes/ViewModeToggle";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useInView } from "react-intersection-observer";
import { RecentlyActive } from "./RecentlyActive";
import { ProfileCompletionPrompt } from "./ProfileCompletionPrompt";
import { supabase } from "@/integrations/supabase/client";
import { FullscreenAdViewer } from "@/components/ads/video-profile/FullscreenAdViewer";
import { SimilarProfiles } from "./SimilarProfiles";
import { SkeletonCards } from "../ads/view-modes/SkeletonCards";
import { QuickMatch } from "./QuickMatch";
import { FavoritesView } from "./FavoritesView";
import { StickyHeader } from "./StickyHeader";
import { FloatingActionButton } from "./FloatingActionButton";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { AllAdsTab } from "./DatingContent/AllAdsTab";
import { TrendingAdsTab } from "./DatingContent/TrendingAdsTab";
import { PopularAdsTab } from "./DatingContent/PopularAdsTab";
import { QuickMatchTab } from "./DatingContent/QuickMatchTab";
import { FavoritesTab } from "./DatingContent/FavoritesTab";
import { NearbyTab } from "./DatingContent/NearbyTab";
import { useContentTabs } from "./DatingContent/useContentTabs";

// Import our custom animations
import "@/components/styles/dating-animations.css";

interface DatingContentProps {
  ads: DatingAd[] | undefined;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  onTagClick?: (tag: string) => void;
  isLoading?: boolean;
  userProfile?: DatingAd | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onFilterToggle?: () => void;
}

export const DatingContent = ({ 
  ads, 
  canAccessBodyContact, 
  onAdCreationSuccess,
  onTagClick,
  isLoading = false,
  userProfile,
  activeTab = "browse",
  onTabChange,
  onFilterToggle
}: DatingContentProps) => {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [scrollPosition, setScrollPosition] = useState(0);
  const { ref: tabsRef, inView: tabsInView } = useInView({
    threshold: 0,
    rootMargin: "-50px 0px 0px 0px"
  });
  
  // Use split logic hook for state
  const {
    viewMode, setViewMode, browseSubTab, setBrowseSubTab, selectedAd, setSelectedAd,
    mostViewedAds, trendingAds
  } = useContentTabs(ads);

  // Utility function for clickable tags
  const makeTagClickable = (ads: any) => {
    if (!ads || !onTagClick) return ads;
    return ads.map((ad: any) => ({
      ...ad,
      tags: ad.tags?.map((tag: string) => tag) || [],
      onTagClick
    }));
  };

  // Quick interactions for mobile
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

  // Store scroll position when changing tabs
  useEffect(() => {
    const savedPosition = scrollPosition;
    const timer = setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [viewMode, browseSubTab, scrollPosition, activeTab]);
  
  // Track scroll position
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
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // Tabs content
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1 space-y-6"
    >
      {/* Floating header for sticky tabs/navigation */}
      {showFloatingTabs && (
        <StickyHeader 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onFilterToggle={onFilterToggle}
        />
      )}
      
      {/* Floating action button for mobile */}
      {isMobile && (
        <FloatingActionButton 
          showFilters={onFilterToggle}
          onLike={handleLike}
          onSkip={handleSkip}
          onMessage={handleMessage}
        />
      )}

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
    </motion.div>
  );
};
