
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
      <video
        ref={ref}
        src={videoUrl}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        muted={false}
        controls={false}
        onEnded={onEnded}
      />
    );
  }
);

StoryVideo.displayName = "StoryVideo";
