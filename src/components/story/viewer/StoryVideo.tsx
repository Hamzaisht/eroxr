
import { forwardRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused }, ref) => {
    const { toast } = useToast();

    const handleError = useCallback(() => {
      console.error("Video loading error:", videoUrl);
      toast({
        title: "Video Error",
        description: "Failed to play video. Please try again.",
        variant: "destructive",
      });
    }, [toast, videoUrl]);

    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        if (isPaused) {
          videoElement.current.pause();
        } else {
          videoElement.current.play().catch(error => {
            console.error("Error playing video:", error);
            handleError();
          });
        }
      }
    }, [isPaused, ref, handleError]);

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black aspect-[9/16] w-full h-full">
        <video
          ref={ref}
          src={videoUrl}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted={false}
          controls={false}
          onEnded={onEnded}
          onError={handleError}
          style={{
            objectPosition: 'center center'
          }}
        />
      </div>
    );
  }
);

StoryVideo.displayName = "StoryVideo";
