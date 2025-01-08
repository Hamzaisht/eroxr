import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  index: number;
  onIndexChange: (index: number) => void;
}

export const VideoPlayer = ({ src, index, onIndexChange }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset video source and load it
            video.src = src;
            video.load();
            
            // Play after metadata is loaded
            const playVideo = () => {
              video.play().catch((error) => {
                console.error("Error playing video:", error);
              });
            };

            // Remove any existing loadedmetadata listeners
            video.removeEventListener('loadedmetadata', playVideo);
            // Add new listener
            video.addEventListener('loadedmetadata', playVideo, { once: true });
            
            onIndexChange(index);
          } else {
            // Pause and reset when out of view
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { 
        threshold: 0.7,
        root: null,
        rootMargin: "0px"
      }
    );

    observer.observe(video);
    
    return () => {
      video.removeEventListener('loadedmetadata', () => {});
      observer.disconnect();
    };
  }, [src, index, onIndexChange]);

  return (
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
  );
};