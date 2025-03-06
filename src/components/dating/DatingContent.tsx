
import { motion } from "framer-motion";
import { useState } from "react";
import { DatingAd } from "@/components/ads/types/dating";
import { EmptyProfilesState } from "./EmptyProfilesState";
import { useSession } from "@supabase/auth-helpers-react";
import { TrendingUp, AlertCircle, Eye, Grid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GridViewMode, ListViewMode } from "@/components/ads/view-modes";

interface DatingContentProps {
  ads: DatingAd[] | undefined;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
  onTagClick?: (tag: string) => void;
}

export const DatingContent = ({ 
  ads, 
  canAccessBodyContact, 
  onAdCreationSuccess,
  onTagClick
}: DatingContentProps) => {
  const session = useSession();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter most viewed ads (top 5)
  const mostViewedAds = ads
    ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    ?.slice(0, 5);

  // Filter trending ads (based on recency and views)
  const trendingAds = ads
    ?.sort((a, b) => {
      // Custom scoring: 0.7 * recency + 0.3 * views
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      const recencyScoreA = dateA.getTime();
      const recencyScoreB = dateB.getTime();
      
      const viewScoreA = a.view_count || 0;
      const viewScoreB = b.view_count || 0;
      
      const totalScoreA = 0.7 * recencyScoreA + 0.3 * viewScoreA;
      const totalScoreB = 0.7 * recencyScoreB + 0.3 * viewScoreB;
      
      return totalScoreB - totalScoreA;
    })
    ?.slice(0, 5);

  // All ads for "All Ads" tab
  const allAds = ads;

  // Check if we have any ads to display
  const hasAds = allAds && allAds.length > 0;

  // Make ad elements clickable for tag filtering
  const makeTagClickable = (ads: DatingAd[] | undefined) => {
    if (!ads || !onTagClick) return ads;
    
    return ads.map(ad => ({
      ...ad,
      tags: ad.tags?.map(tag => tag) || [],
      onTagClick
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1 space-y-6"
    >
      {hasAds ? (
        <>
          <div className="flex justify-between items-center">
            <Tabs defaultValue="all" className="w-full">
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
                <div className="flex bg-luxury-dark/30 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex items-center gap-1"
                  >
                    <Grid className="h-4 w-4" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-1"
                  >
                    <List className="h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>
              
              <TabsContent value="all" className="space-y-4">
                {allAds && allAds.length > 0 ? (
                  viewMode === 'grid' ? (
                    <GridViewMode ads={makeTagClickable(allAds) as DatingAd[]} />
                  ) : (
                    <ListViewMode ads={makeTagClickable(allAds) as DatingAd[]} />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl">
                    <AlertCircle className="h-12 w-12 text-luxury-primary/40 mb-4" />
                    <h3 className="text-xl font-bold text-luxury-primary mb-2">No Ads Available</h3>
                    <p className="text-luxury-neutral/60 max-w-md">
                      No body contact ads match your current filters. Adjust your filters or create your own ad.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="trending" className="space-y-4">
                {trendingAds && trendingAds.length > 0 ? (
                  viewMode === 'grid' ? (
                    <GridViewMode ads={makeTagClickable(trendingAds) as DatingAd[]} />
                  ) : (
                    <ListViewMode ads={makeTagClickable(trendingAds) as DatingAd[]} />
                  )
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
              
              <TabsContent value="popular" className="space-y-4">
                {mostViewedAds && mostViewedAds.length > 0 ? (
                  viewMode === 'grid' ? (
                    <GridViewMode ads={makeTagClickable(mostViewedAds) as DatingAd[]} />
                  ) : (
                    <ListViewMode ads={makeTagClickable(mostViewedAds) as DatingAd[]} />
                  )
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
