import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DatingAd } from "../ads/types/dating";
import { EmptyProfilesState } from "./EmptyProfilesState";
import { useSession } from "@supabase/auth-helpers-react";
import { TrendingUp, AlertCircle, Eye } from "lucide-react";
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

// Import our custom animations
import "@/components/styles/dating-animations.css";

interface DatingContentProps {
  ads: DatingAd[] | undefined;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  onTagClick?: (tag: string) => void;
  isLoading?: boolean;
  userProfile?: DatingAd | null; // User's own profile if they have one
}

export const DatingContent = ({ 
  ads, 
  canAccessBodyContact, 
  onAdCreationSuccess,
  onTagClick,
  isLoading = false,
  userProfile
}: DatingContentProps) => {
  const session = useSession();
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('bd-view-mode', 'grid');
  const [activeTab, setActiveTab] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const { ref: tabsRef, inView: tabsInView } = useInView({
    threshold: 0,
    rootMargin: "-50px 0px 0px 0px"
  });
  
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
  }, [viewMode, activeTab, scrollPosition]);
  
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1 space-y-6"
    >
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
              onValueChange={(value) => setActiveTab(value)}
              value={activeTab}
            >
              <TabsList className="grid grid-cols-3 mb-6">
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
          
          {/* Floating tabs that appear when scrolling */}
          {showFloatingTabs && (
            <motion.div 
              className="fixed top-0 left-0 right-0 z-40 px-4 py-2 bg-luxury-dark/80 backdrop-blur-xl border-b border-luxury-primary/10"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
            >
              <div className="container mx-auto flex justify-between items-center">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="all" className="text-sm">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="text-sm">
                      Trending
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="text-sm">
                      Popular
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="hidden md:block">
                  <ViewModeToggle 
                    viewMode={viewMode} 
                    setViewMode={setViewMode} 
                    size="sm"
                  />
                </div>
              </div>
            </motion.div>
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
    </motion.div>
  );
};
