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
            console.log("Video in view, attempting to play:", video.src);
            // Reset the video source to force reload
            video.src = src;
            video.load();
            // Play after load
            video.addEventListener('loadedmetadata', () => {
              video.play().catch((error) => {
                console.error("Error playing video:", error);
              });
            }, { once: true });
            onIndexChange(index);
          } else {
            console.log("Video out of view, pausing:", video.src);
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, index, onIndexChange]);

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      playsInline
      muted
      loop
      onClick={(e) => {
        const video = e.currentTarget;
        if (video.paused) {
          console.log("Playing video on click");
          video.play().catch(e => console.error("Error playing video:", e));
        } else {
          console.log("Pausing video on click");
          video.pause();
        }
      }}
    />
  );
};