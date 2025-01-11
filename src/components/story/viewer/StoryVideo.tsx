import { motion } from "framer-motion";
import { forwardRef, useEffect, useRef } from "react";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused }, ref) => {
    const videoRef = useRef<HTMLVideoElement>();

    useEffect(() => {
      // Set up video element reference
      if (ref) {
        videoRef.current = (ref as React.MutableRefObject<HTMLVideoElement>).current;
      }

      // Preload the video
      if (videoRef.current) {
        videoRef.current.preload = "auto";
        videoRef.current.load();
      }
    }, [ref]);

    useEffect(() => {
      if (videoRef.current) {
        if (isPaused) {
          videoRef.current.pause();
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Video playback error:", error);
            });
          }
        }
      }
    }, [isPaused]);

    return (
      <motion.video
        ref={ref as any}
        src={videoUrl}
        className="h-full w-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        playsInline
        autoPlay
        preload="auto"
        poster={`${videoUrl}?poster=true`}
        muted={false}
        controls={false}
        onEnded={onEnded}
        style={{ 
          pointerEvents: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      />
    );
  }
);

StoryVideo.displayName = "StoryVideo";