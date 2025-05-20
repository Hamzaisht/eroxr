
import React from 'react';
import { VideoProfileCardProps } from './types';
import { VideoContent } from './VideoContent';
import { ProfileBadges } from './ProfileBadges';
import { ProfileInfo } from './ProfileInfo';

export const VideoProfileCard = ({ 
  ad, 
  isPreviewMode = false,
  isAnimation = false,
  isActive = false 
}: VideoProfileCardProps) => {
  return (
    <div className={`relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-xl transition-all ${isAnimation ? 'h-[600px]' : 'h-auto'}`}>
      {/* Video Content */}
      <VideoContent 
        ad={ad} 
        isActive={isActive} 
        isPreviewMode={isPreviewMode}
        isAnimation={isAnimation}
      />
      
      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/90 to-transparent">
        <ProfileBadges ad={ad} />
        <ProfileInfo ad={ad} isPreviewMode={isPreviewMode} />
      </div>
    </div>
  );
};

export default VideoProfileCard;
