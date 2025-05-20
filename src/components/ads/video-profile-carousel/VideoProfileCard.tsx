
import { useState, useEffect } from "react";
import { DatingAd } from "@/types/dating";
import { VideoContent } from "./VideoContent";
import { ProfileBadges } from "./ProfileBadges";
import { ProfileInfo } from "./ProfileInfo";
import { AdActions } from "./AdActions";

export interface VideoProfileCardProps {
  ad: DatingAd;
  isActive?: boolean;
  isAnimation?: boolean;
}

export const VideoProfileCard = ({ ad, isActive = false, isAnimation = false }: VideoProfileCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Activate video based on active state
    if (isActive) {
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);

  return (
    <div className={`relative w-full h-full max-w-md mx-auto overflow-hidden rounded-xl bg-luxury-darker ${
      isAnimation ? 'shadow-2xl' : ''
    }`}>
      <VideoContent 
        videoUrl={ad.videoUrl || ad.video_url || ""} 
        avatarUrl={ad.avatarUrl || ad.avatar_url || ""} 
        isPlaying={isPlaying}
      />
      
      <ProfileBadges 
        isPremium={ad.isPremium || ad.is_premium || false}
        isVerified={ad.isVerified || ad.is_verified || false}
      />
      
      <ProfileInfo ad={ad} isPreviewMode={!isActive} />
      
      {isActive && <AdActions ad={ad} />}
    </div>
  );
};
