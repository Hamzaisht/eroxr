
import { GridViewMode, ListViewMode } from "@/components/ads/view-modes";
import { SkeletonCards } from "@/components/ads/view-modes/SkeletonCards";
import { Eye } from "lucide-react";
import { DatingAd } from "@/components/ads/types/dating";

interface PopularAdsTabProps {
  mostViewedAds: DatingAd[] | undefined;
  isLoading: boolean;
  userProfile: DatingAd | null;
  viewMode: 'grid' | 'list';
  makeTagClickable: (ads: DatingAd[] | undefined) => DatingAd[] | undefined;
}

export function PopularAdsTab({
  mostViewedAds,
  isLoading,
  userProfile,
  viewMode,
  makeTagClickable,
}: PopularAdsTabProps) {
  return mostViewedAds && mostViewedAds.length > 0 ? (
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
  );
}
