
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
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('bd-view-mode', 'grid');
  const [browseSubTab, setBrowseSubTab] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const { ref: tabsRef, inView: tabsInView } = useInView({
    threshold: 0,
    rootMargin: "-50px 0px 0px 0px"
  });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  
  // Filter most viewed ads (top 8)
  const mostViewedAds = ads
    ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    ?.slice(0, 8);

  // Filter trending ads (based on recency and views)
  const trendingAds = ads
    ?.sort((a, b) => {
      // Custom scoring: 0.7 * recency + 0.3 * views
      const dateA = new Date(a.created_at ?? '');
      const dateB = new Date(b.created_at ?? '');
      const recencyScoreA = dateA.getTime();
      const recencyScoreB = dateB.getTime();
      
      const viewScoreA = a.view_count || 0;
      const viewScoreB = b.view_count || 0;
      
      const totalScoreA = 0.7 * recencyScoreA + 0.3 * viewScoreA;
      const totalScoreB = 0.7 * recencyScoreB + 0.3 * viewScoreB;
      
      return totalScoreB - totalScoreA;
    })
    ?.slice(0, 8);

  // All ads for "All" tab
  const allAds = ads;

  // Check if we have any ads to display
  const hasAds = allAds && allAds.length > 0;
  
  // Function to handle profile selection
  const handleSelectProfile = (ad: DatingAd) => {
    setSelectedAd(ad);
    
    // Track view in analytics
    if (ad.id && session) {
      supabase.from('dating_ads').update({ 
        view_count: (ad.view_count || 0) + 1 
      }).eq('id', ad.id);
    }
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

  // Make ad elements clickable for tag filtering
  const makeTagClickable = (ads: DatingAd[] | undefined) => {
    if (!ads || !onTagClick) return ads;
    
    return ads.map(ad => ({
      ...ad,
      tags: ad.tags?.map(tag => tag) || [],
      onTagClick
    }));
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1 space-y-6"
    >
      {/* Sticky header for improved navigation */}
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
      
      {/* Main content tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Browse Tab */}
        <TabsContent value="browse">
          {hasAds || isLoading ? (
            <>
              {/* Profile completion prompt if user is logged in */}
              {session && userProfile && (
                <ProfileCompletionPrompt userProfile={userProfile} />
              )}
              
              {/* Recently active users */}
              {!isLoading && allAds && allAds.length > 0 && (
                <RecentlyActive 
                  ads={allAds} 
                  onSelectProfile={handleSelectProfile} 
                />
              )}
              
              <div className="relative" ref={tabsRef}>
                <Tabs 
                  defaultValue="all" 
                  className="w-full"
                  onValueChange={(value) => setBrowseSubTab(value)}
                  value={browseSubTab}
                >
                  <TabsList className={`grid grid-cols-3 mb-6 ${isMobile ? 'w-full' : ''}`}>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      All Ads
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Most Viewed
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex justify-end mb-4">
                    <ViewModeToggle 
                      viewMode={viewMode} 
                      setViewMode={setViewMode} 
                    />
                  </div>
                  
                  <TabsContent value="all" className="space-y-6">
                    {viewMode === 'grid' ? (
                      <GridViewMode 
                        ads={makeTagClickable(allAds) as DatingAd[]} 
                        isLoading={isLoading}
                        userProfile={userProfile}
                      />
                    ) : (
                      <ListViewMode 
                        ads={makeTagClickable(allAds) as DatingAd[]} 
                        isLoading={isLoading}
                        userProfile={userProfile}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="trending" className="space-y-6">
                    {trendingAds && trendingAds.length > 0 ? (
                      viewMode === 'grid' ? (
                        <GridViewMode 
                          ads={makeTagClickable(trendingAds) as DatingAd[]} 
                          userProfile={userProfile}
                        />
                      ) : (
                        <ListViewMode 
                          ads={makeTagClickable(trendingAds) as DatingAd[]} 
                          userProfile={userProfile}
                        />
                      )
                    ) : isLoading ? (
                      <SkeletonCards count={4} type={viewMode} />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl">
                        <TrendingUp className="h-12 w-12 text-luxury-primary/40 mb-4" />
                        <h3 className="text-xl font-bold text-luxury-primary mb-2">No Trending Ads Yet</h3>
                        <p className="text-luxury-neutral/60 max-w-md">
                          Be the first to create a trending body contact ad that will appear here!
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="popular" className="space-y-6">
                    {mostViewedAds && mostViewedAds.length > 0 ? (
                      viewMode === 'grid' ? (
                        <GridViewMode 
                          ads={makeTagClickable(mostViewedAds) as DatingAd[]} 
                          userProfile={userProfile}
                        />
                      ) : (
                        <ListViewMode 
                          ads={makeTagClickable(mostViewedAds) as DatingAd[]} 
                          userProfile={userProfile}
                        />
                      )
                    ) : isLoading ? (
                      <SkeletonCards count={4} type={viewMode} />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl">
                        <Eye className="h-12 w-12 text-luxury-primary/40 mb-4" />
                        <h3 className="text-xl font-bold text-luxury-primary mb-2">No Popular Ads Yet</h3>
                        <p className="text-luxury-neutral/60 max-w-md">
                          Popular ads with the most views will appear here. Create yours now!
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Similar profiles display when viewing a specific ad */}
              {selectedAd && allAds && (
                <SimilarProfiles 
                  currentAd={selectedAd} 
                  allAds={allAds} 
                  onSelectProfile={handleSelectProfile}
                />
              )}
              
              {/* Full screen profile viewer */}
              {selectedAd && (
                <FullscreenAdViewer 
                  ad={selectedAd} 
                  onClose={() => setSelectedAd(null)} 
                />
              )}
            </>
          ) : (
            <EmptyProfilesState 
              canAccessBodyContact={canAccessBodyContact}
              onAdCreationSuccess={onAdCreationSuccess}
            />
          )}
        </TabsContent>
        
        {/* Quick Match Tab */}
        <TabsContent value="quick-match">
          {hasAds || isLoading ? (
            <>
              {session && userProfile && (
                <ProfileCompletionPrompt userProfile={userProfile} />
              )}
              
              <QuickMatch ads={ads || []} userProfile={userProfile || null} />
            </>
          ) : (
            <EmptyProfilesState 
              canAccessBodyContact={canAccessBodyContact}
              onAdCreationSuccess={onAdCreationSuccess}
            />
          )}
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites">
          {session ? (
            <FavoritesView userProfile={userProfile || null} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl min-h-[300px]">
              <Heart className="h-12 w-12 text-luxury-primary/40 mb-4" />
              <h3 className="text-xl font-bold text-luxury-primary mb-2">Sign in to View Favorites</h3>
              <p className="text-luxury-neutral/60 max-w-md">
                Please sign in to save and view your favorite profiles.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Nearby Tab */}
        <TabsContent value="nearby">
          <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl min-h-[300px]">
            <AlertCircle className="h-12 w-12 text-luxury-primary/40 mb-4" />
            <h3 className="text-xl font-bold text-luxury-primary mb-2">Location Access Required</h3>
            <p className="text-luxury-neutral/60 max-w-md">
              Enable location access to see profiles near you. This feature helps you find matches in your area.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
