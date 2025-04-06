
import { forwardRef, useEffect, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
  creatorId: string;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused, creatorId }, ref) => {
    const { toast } = useToast();
    const [watermarkUsername, setWatermarkUsername] = useState<string>("eroxr");

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

    useEffect(() => {
      getUsernameForWatermark(creatorId).then(name => {
        setWatermarkUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }, [creatorId]);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
        <div className="relative w-full h-full max-w-[500px] mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
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
                maxHeight: '100vh',
                backgroundColor: 'black',
                objectFit: 'cover'
              }}
            />
          </div>
          
          {/* Watermark overlay */}
          <div className="watermark-overlay">
            www.eroxr.com/@{watermarkUsername}
          </div>
        </div>
      </div>
    );
  }
);

StoryVideo.displayName = "StoryVideo";
