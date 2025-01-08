import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  index: number;
  onIndexChange: (index: number) => void;
}

export const VideoPlayer = ({ src, index, onIndexChange }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset state
    setIsLoading(true);
    setError(null);

    const handleLoadedData = () => {
      console.log("Video loaded:", src);
      setIsLoading(false);
      if (video.paused) {
        video.play().catch(error => {
          console.error("Error playing video:", error);
          setError("Failed to play video");
        });
      }
    };

    const handleError = () => {
      console.error("Video error for source:", src);
      setError("Failed to load video");
      setIsLoading(false);
    };

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Video in view:", src);
            onIndexChange(index);
            video.load(); // Explicitly load the video
            video.play().catch(error => {
              console.error("Error playing video:", error);
              setError("Failed to play video");
            });
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      {
        threshold: 0.7 // Increased threshold for better visibility detection
      }
    );

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    observer.observe(video);

    // Set video source
    if (video.src !== src) {
      video.src = src;
      video.load();
    }

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
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        loop
        preload="auto"
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-white text-center px-4 py-2 bg-red-500/80 rounded">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};