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

    setIsLoading(true);
    setError(null);

    const handleLoadedData = () => {
      setIsLoading(false);
      video.play().catch(err => {
        console.error("Play error:", err);
        setError("Failed to play video");
      });
    };

    const handleError = () => {
      console.error("Video error:", src);
      setError("Failed to load video");
      setIsLoading(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIndexChange(index);
            if (video.paused) {
              video.play().catch(err => {
                console.error("Play error:", err);
                setError("Failed to play video");
              });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    observer.observe(video);

    // Set source and load
    video.src = src;
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      observer.disconnect();
      video.pause();
      video.removeAttribute('src');
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
        controls={false}
        preload="auto"
        onClick={(e) => {
          const video = e.currentTarget;
          if (video.paused) {
            video.play().catch(console.error);
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