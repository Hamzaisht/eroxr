
import { motion } from "framer-motion";
import { DatingAd } from "@/components/ads/types/dating";
import { VideoProfileCarousel } from "@/components/ads/VideoProfileCarousel";
import { EmptyProfilesState } from "./EmptyProfilesState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "@supabase/auth-helpers-react";
import { Clock, AlertCircle, TrendingUp, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface DatingContentProps {
  ads: DatingAd[] | undefined;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export const DatingContent = ({ 
  ads, 
  canAccessBodyContact, 
  onAdCreationSuccess 
}: DatingContentProps) => {
  const session = useSession();
  const currentUserId = session?.user?.id;
  const [hasAds, setHasAds] = useState(false);
  
  useEffect(() => {
    // Log to help debugging
    console.log("DatingContent - Ads received:", ads?.length);
    console.log("DatingContent - User ID:", currentUserId);
    
    if (ads && ads.length > 0) {
      setHasAds(true);
      console.log("DatingContent - Has ads:", true);
    } else {
      setHasAds(false);
      console.log("DatingContent - Has ads:", false);
    }
  }, [ads, currentUserId]);
  
  // Check if the user has any pending ads
  const hasPendingAds = ads?.some(ad => 
    ad.moderation_status === 'pending' && ad.user_id === currentUserId
  );

  // Check if the user has any approved ads
  const hasApprovedAds = ads?.some(ad => 
    ad.moderation_status === 'approved' && ad.user_id === currentUserId
  );

  // Filter most viewed ads (top 5)
  const mostViewedAds = ads
    ?.filter(ad => ad.moderation_status === 'approved' || ad.user_id === currentUserId)
    ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    ?.slice(0, 5);

  // Filter trending ads (based on recency and views)
  const trendingAds = ads
    ?.filter(ad => ad.moderation_status === 'approved' || ad.user_id === currentUserId)
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
  const allAds = ads?.filter(ad => 
    ad.moderation_status === 'approved' || ad.user_id === currentUserId
  );

  console.log("All ads count:", allAds?.length);
  console.log("Pending ads for current user:", hasPendingAds);
  console.log("Approved ads for current user:", hasApprovedAds);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1 space-y-6"
    >
      {hasPendingAds && (
        <Alert className="bg-amber-50 border-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Your ad is awaiting moderation</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your ad has been submitted successfully but must be approved before it's visible to others. 
            You can see your ad below, but other users won't see it until it's approved.
          </AlertDescription>
        </Alert>
      )}
      
      {!hasPendingAds && hasApprovedAds && (
        <Alert className="bg-green-50 border-green-300">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Your ad is live!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your body contact ad has been approved and is now visible to all users.
          </AlertDescription>
        </Alert>
      )}
      
      {hasAds ? (
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
          
          <TabsContent value="all" className="space-y-4">
            {allAds && allAds.length > 0 ? (
              <VideoProfileCarousel ads={allAds} />
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
              <VideoProfileCarousel ads={trendingAds} />
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
              <VideoProfileCarousel ads={mostViewedAds} />
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
      ) : (
        <EmptyProfilesState 
          canAccessBodyContact={canAccessBodyContact}
          onAdCreationSuccess={onAdCreationSuccess}
        />
      )}
    </motion.div>
  );
};
