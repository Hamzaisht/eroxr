
import { GridViewMode, ListViewMode } from "@/components/ads/view-modes";
import { SkeletonCards } from "@/components/ads/view-modes/SkeletonCards";
import { ProfileCompletionPrompt } from "../ProfileCompletionPrompt";
import { RecentlyActive } from "../RecentlyActive";
import { SimilarProfiles } from "../SimilarProfiles";
import { FullscreenAdViewer } from "@/components/ads/video-profile/FullscreenAdViewer";
import { DatingAd } from "@/components/ads/types/dating";

interface AllAdsTabProps {
  allAds: DatingAd[] | undefined;
  isLoading: boolean;
  userProfile: DatingAd | null;
  setSelectedAd: (ad: DatingAd | null) => void;
  selectedAd: DatingAd | null;
  session: any;
  viewMode: 'grid' | 'list';
  makeTagClickable: (ads: DatingAd[] | undefined) => DatingAd[] | undefined;
  onSelectProfile: (ad: DatingAd) => void;
  browseSubTab: string;
  setBrowseSubTab: (val: string) => void;
}

export function AllAdsTab({
  allAds,
  isLoading,
  userProfile,
  setSelectedAd,
  selectedAd,
  session,
  viewMode,
  makeTagClickable,
  onSelectProfile,
  browseSubTab,
  setBrowseSubTab,
}: AllAdsTabProps) {
  return (
    <>
      {session && userProfile && (
        <ProfileCompletionPrompt userProfile={userProfile} />
      )}
      {!isLoading && allAds && allAds.length > 0 && (
        <RecentlyActive 
          ads={allAds} 
          onSelectProfile={onSelectProfile} 
        />
      )}

      <div className="relative">
        <div className="flex justify-end mb-4">
          {/* View mode toggle handled by parent */}
        </div>
        <div className="space-y-6">
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
        </div>
      </div>
      {selectedAd && allAds && (
        <SimilarProfiles 
          currentAd={selectedAd} 
          allAds={allAds} 
          onSelectProfile={onSelectProfile}
        />
      )}
      {selectedAd && (
        <FullscreenAdViewer 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)} 
        />
      )}
    </>
  );
}
