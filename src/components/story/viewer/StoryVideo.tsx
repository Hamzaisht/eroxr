import { motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused }, ref) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        if (isPaused) {
          videoElement.current.pause();
        } else {
          videoElement.current.play().catch(error => {
            console.error("Video playback error:", error);
          });
        }
      }
    }, [isPaused, ref]);

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-dark/50">
            <div className="h-8 w-8 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
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
          poster={`${videoUrl}?poster=true`}
          muted={false}
          controls={false}
          onEnded={onEnded}
          onLoadedData={handleLoadedData}
          style={{ 
            pointerEvents: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        />
      </>
    );
  }
);

StoryVideo.displayName = "StoryVideo";