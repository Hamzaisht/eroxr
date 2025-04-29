
import { useRef, useEffect, useState } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface BackgroundVideoProps {
  videoUrl: string;
  className?: string;
  fallbackImage?: string;
  overlayOpacity?: number;
  webmUrl?: string;
}

export const BackgroundVideo = ({
  videoUrl,
  className,
  fallbackImage,
  overlayOpacity = 50,
  webmUrl
}: BackgroundVideoProps) => {
  const [isUnsupported, setIsUnsupported] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const {
    videoRef,
    isLoading,
    hasError,
    processedUrl
  } = useMediaPlayer({
    url: videoUrl,
    autoPlay: true,
    muted: true,
    loop: true
  });

  // Check for reduced motion preference or mobile devices
  useEffect(() => {
    // Check if this is a low-power device or browser that might struggle
    const isLowPowerMode = window.matchMedia('(prefers-reduced-data: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    // Modified version that avoids using navigator.connection directly
    const hasSaveData = () => {
      // Type-safe check for saveData property on navigator
      // @ts-ignore - This ignores TypeScript error for saveData which may exist in some browsers
      return typeof navigator !== 'undefined' && 'connection' in navigator && navigator.connection?.saveData === true;
    };
    
    const shouldDisableVideo = isLowPowerMode || (isMobile && !hasSaveData());
    
    if (shouldDisableVideo) {
      setIsUnsupported(true);
    }
  }, []);

  // Ensure video plays as soon as it's loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    // Try to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing background video:', error);
        // If autoplay fails, we'll show the fallback
        setIsUnsupported(true);
      });
    }
  }, [videoRef, processedUrl, prefersReducedMotion]);

  // If user prefers reduced motion, show static background
  if (prefersReducedMotion || isUnsupported) {
    return (
      <div className={cn(
        "fixed inset-0 -z-10 overflow-hidden",
        className
      )}>
        {/* Dark gradient background as fallback */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-luxury-dark via-luxury-darker to-black"
          aria-hidden="true"
        />
        
        {/* Fallback image if provided */}
        {fallbackImage && (
          <div
            className="absolute inset-0 bg-center bg-cover opacity-60"
            style={{ backgroundImage: `url(${fallbackImage})` }}
          />
        )}
        
        {/* Consistent overlay */}
        <div 
          className={`absolute inset-0 z-10 bg-black/${overlayOpacity}`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed inset-0 -z-10 overflow-hidden",
      className
    )}>
      {/* Dark overlay for better text contrast */}
      <div 
        className={`absolute inset-0 z-10 bg-black/${overlayOpacity}`}
        aria-hidden="true"
      />
      
      {/* Fallback image for error state */}
      {(hasError || isLoading) && fallbackImage && (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Video element with multiple sources for better browser support */}
      <video
        ref={videoRef}
        className="absolute h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        preload="auto"
      >
        {/* WebM for Chrome, Firefox, Edge */}
        {webmUrl && <source src={webmUrl} type="video/webm" />}
        {/* MP4 for Safari and fallback */}
        <source src={processedUrl} type="video/mp4" />
      </video>
    </div>
  );
};
