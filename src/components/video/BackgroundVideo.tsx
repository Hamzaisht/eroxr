
import { useRef, useEffect } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { cn } from '@/lib/utils';

interface BackgroundVideoProps {
  videoUrl: string;
  className?: string;
  fallbackImage?: string;
  overlayOpacity?: number;
}

export const BackgroundVideo = ({
  videoUrl,
  className,
  fallbackImage,
  overlayOpacity = 50
}: BackgroundVideoProps) => {
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

  // Ensure video plays as soon as it's loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing background video:', error);
      });
    }
  }, [videoRef, processedUrl]);

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
      {hasError && fallbackImage && (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={processedUrl}
        className="absolute h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    </div>
  );
};
