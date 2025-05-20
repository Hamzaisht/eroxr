
import React, { useState, useEffect, useRef } from 'react';
import { UniversalMedia } from '@/components/media/UniversalMedia';
import { VideoContentProps } from './types';

export function VideoContent({ 
  ad, 
  isActive = false, 
  isPreviewMode = false,
  isHovered = false,
  isAnimation = false
}: VideoContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && (isHovered || isAnimation)) {
        videoRef.current.play().catch(err => console.error("Video playback error:", err));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isHovered, isAnimation]);

  return (
    <div className="relative w-full h-full aspect-[9/16]">
      <UniversalMedia
        ref={videoRef}
        item={ad.videoUrl || ad.video_url || ""}
        className="w-full h-full object-cover"
        autoPlay={isActive && !isPreviewMode}
        controls={false}
        muted={true}
        loop={true}
        poster={ad.avatarUrl || ad.avatar_url || ""}
        onError={(e) => console.error("Video error:", e)}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="play-button-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white opacity-80">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
