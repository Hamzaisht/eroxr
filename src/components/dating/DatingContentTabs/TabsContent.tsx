
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AllAdsTab } from "./AllAdsTab";
import { TrendingAdsTab } from "./TrendingAdsTab";
import { PopularAdsTab } from "./PopularAdsTab";
import { QuickMatchTab } from "./QuickMatchTab";
import { FavoritesTab } from "./FavoritesTab";
import { NearbyTab } from "./NearbyTab";
import { OnlineTab } from "../DatingContent/OnlineTab";
import { DatingAd } from "@/components/ads/types/dating";

interface TabsContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  ads: DatingAd[];
  isLoading: boolean;
  userProfile: DatingAd | null;
  session: any;
  viewMode: 'grid' | 'list';
  makeTagClickable: (ads: DatingAd[]) => DatingAd[];
  selectedAd: DatingAd | null;
  setSelectedAd: (ad: DatingAd | null) => void;
  browseSubTab: string;
  setBrowseSubTab: (value: string) => void;
  mostViewedAds: DatingAd[];
  trendingAds: DatingAd[];
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export function DatingContentTabs({
  activeTab,
  onTabChange,
  ads,
  isLoading,
  userProfile,
  session,
  viewMode,
  makeTagClickable,
  selectedAd,
  setSelectedAd,
  browseSubTab,
  setBrowseSubTab,
  mostViewedAds,
  trendingAds,
  canAccessBodyContact,
  onAdCreationSuccess,
}: TabsContentProps) {
  return (
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
      <TabsContent value="online">
        <OnlineTab
          session={session}
          userProfile={userProfile}
        />
      </TabsContent>
    </Tabs>
  );
}
