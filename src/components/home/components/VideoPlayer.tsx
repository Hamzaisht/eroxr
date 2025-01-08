import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  index: number;
  onIndexChange: (index: number) => void;
}

export const VideoPlayer = ({ src, index, onIndexChange }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video state
    video.pause();
    video.currentTime = 0;
    setIsLoading(true);

    // Set up video event listeners
    const handleLoadedData = () => {
      setIsLoading(false);
      if (video.paused) {
        video.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Video loading error:", e);
      setIsLoading(false);
    };

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIndexChange(index);
            // Only set src and load when video comes into view
            if (video.src !== src) {
              video.src = src;
              video.load();
            }
            video.play().catch(error => {
              console.error("Error playing video:", error);
            });
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-10% 0px"
      }
    );

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    observer.observe(video);

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      observer.disconnect();
      video.pause();
      video.src = '';
      video.load();
    };
  }, [src, index, onIndexChange]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        loop
        preload="metadata"
        onClick={(e) => {
          const video = e.currentTarget;
          if (video.paused) {
            video.play().catch(e => console.error("Error playing video:", e));
          } else {
            video.pause();
          }
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-8 h-8 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};