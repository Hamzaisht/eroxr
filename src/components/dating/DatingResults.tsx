
import React from "react";
import { VideoProfileCarousel } from "@/components/ads/video-profile-carousel/VideoProfileCarousel";
import { DatingContent } from "@/components/dating/DatingContent";
import { Loader2 } from "lucide-react";
import { DatingAd } from "@/components/ads/types/dating";

interface DatingResultsProps {
  datingAds: DatingAd[] | undefined;
  isLoading: boolean;
  activeTab: string;
  userProfile: DatingAd | null;
  handleAdCreationSuccess: () => void;
  handleTagClick: (tag: string) => void;
  handleTabChange: (tab: string) => void;
  handleFilterToggle: () => void;
}

export const DatingResults: React.FC<DatingResultsProps> = ({
  datingAds,
  isLoading,
  activeTab,
  userProfile,
  handleAdCreationSuccess,
  handleTagClick,
  handleTabChange,
  handleFilterToggle,
}) => (
  <>
    {isLoading ? (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    ) : (
      <>
        {datingAds && datingAds.length > 0 && activeTab === "browse" ? (
          <div className="grid grid-cols-1 gap-8">
            <div className="relative">
              <VideoProfileCarousel ads={datingAds} />
            </div>
            <DatingContent
              ads={datingAds}
              canAccessBodyContact={true}
              onAdCreationSuccess={handleAdCreationSuccess}
              onTagClick={handleTagClick}
              isLoading={isLoading}
              userProfile={userProfile}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onFilterToggle={handleFilterToggle}
            />
          </div>
        ) : (
          <DatingContent
            ads={datingAds}
            canAccessBodyContact={true}
            onAdCreationSuccess={handleAdCreationSuccess}
            onTagClick={handleTagClick}
            isLoading={isLoading}
            userProfile={userProfile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onFilterToggle={handleFilterToggle}
          />
        )}
      </>
    )}
  </>
);
