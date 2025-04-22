
import { useState, useEffect } from "react";
import { DatingAd } from "@/components/ads/types/dating";

export function useContentTabs(ads: DatingAd[] | undefined) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [browseSubTab, setBrowseSubTab] = useState('all');
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);

  // Find top adverts for popular/trending
  const mostViewedAds = ads
    ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    ?.slice(0, 8);

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

  return {
    viewMode, setViewMode, browseSubTab, setBrowseSubTab, selectedAd, setSelectedAd,
    mostViewedAds, trendingAds
  };
}
