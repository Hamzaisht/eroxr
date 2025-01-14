import { motion } from "framer-motion";
import { forwardRef, useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  index: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, index, onIndexChange, className }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onIndexChange(index);
              video.play().catch(console.error);
            } else {
              video.pause();
              video.currentTime = 0;
            }
          });
        },
        { threshold: 0.7 }
      );

      observerRef.current.observe(video);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [index, onIndexChange]);

    return (
      <motion.video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-cover ${className}`}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        playsInline
        loop
        muted
        controls={false}
        style={{ 
          pointerEvents: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      />
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";