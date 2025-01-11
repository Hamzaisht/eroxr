import { motion } from "framer-motion";
import { forwardRef, useEffect } from "react";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused }, ref) => {
    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        if (isPaused) {
          videoElement.current.pause();
        } else {
          videoElement.current.play().catch(error => {
            console.error("Error playing video:", error);
          });
        }
      }
    }, [isPaused, ref]);

    return (
      <motion.video
        ref={ref}
        src={videoUrl}
        className="h-full w-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        playsInline
        autoPlay
        preload="auto"
        poster={videoUrl + '?poster=true'}
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