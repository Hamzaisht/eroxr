
import { VideoProfileCard } from "../ads/video-profile-card";
import { DatingAd } from "@/types/dating";

interface QuickMatchProps {
  ads: DatingAd[];
  userProfile: DatingAd | null;
}

export function QuickMatch({ ads, userProfile }: QuickMatchProps) {
  if (!ads || ads.length === 0) {
    return <div>No dating ads to display</div>;
  }

  // Make sure all ads have the required properties
  const enrichedAds = ads.map(ad => {
    // Fix the ad object to include all required properties
    const enrichedAd: DatingAd = {
      ...ad,
      tags: ad.tags || [],
      location: ad.location || "Unknown location",
      age: ad.age || 25, // Default age
      views: ad.views || ad.view_count || 0, // Required property
      videoUrl: ad.videoUrl || ad.video_url || "",
      avatarUrl: ad.avatarUrl || ad.avatar_url || ""
    };

    return <VideoProfileCard key={ad.id} ad={enrichedAd} />;
  });

  return <div className="dating-quickmatch-container">{enrichedAds}</div>;
}
