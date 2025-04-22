
import { GridViewMode, ListViewMode } from "@/components/ads/view-modes";
import { SkeletonCards } from "@/components/ads/view-modes/SkeletonCards";
import { TrendingUp } from "lucide-react";
import { DatingAd } from "@/components/ads/types/dating";

interface TrendingAdsTabProps {
  trendingAds: DatingAd[] | undefined;
  isLoading: boolean;
  userProfile: DatingAd | null;
  viewMode: 'grid' | 'list';
  makeTagClickable: (ads: DatingAd[] | undefined) => DatingAd[] | undefined;
}

export function TrendingAdsTab({
  trendingAds,
  isLoading,
  userProfile,
  viewMode,
  makeTagClickable,
}: TrendingAdsTabProps) {
  return trendingAds && trendingAds.length > 0 ? (
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
  );
}
