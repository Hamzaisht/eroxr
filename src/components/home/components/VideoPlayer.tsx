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
    const videoRef = useRef<HTMLVideoElement>();

    useEffect(() => {
      if (ref) {
        videoRef.current = (ref as React.MutableRefObject<HTMLVideoElement>).current;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onIndexChange(index);
              if (videoRef.current) {
                videoRef.current.play().catch(console.error);
              }
            } else {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }
          });
        },
        { threshold: 0.7 }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }, [index, onIndexChange, ref]);

    return (
      <motion.video
        ref={videoRef as any}
        src={src}
        className={`w-full h-full object-cover ${className}`}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
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