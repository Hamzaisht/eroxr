import { motion } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>();

    useEffect(() => {
      // Set up video element reference
      if (ref) {
        videoRef.current = (ref as React.MutableRefObject<HTMLVideoElement>).current;
      }

      if (videoRef.current) {
        const video = videoRef.current;

        const handleLoad = () => {
          console.info('Story video loaded successfully:', videoUrl);
          setIsLoading(false);
          setHasError(false);
          if (!isPaused) {
            video.play().catch(error => {
              console.error("Story video playback error:", error);
              setHasError(true);
            });
          }
        };

        const handleError = (error: any) => {
          console.error("Story video loading error:", error);
          setHasError(true);
          setIsLoading(false);
        };

        video.addEventListener('loadeddata', handleLoad);
        video.addEventListener('error', handleError);

        // Reset states and reload video when URL changes
        setIsLoading(true);
        setHasError(false);
        video.load();

        return () => {
          video.removeEventListener('loadeddata', handleLoad);
          video.removeEventListener('error', handleError);
        };
      }
    }, [ref, videoUrl, isPaused]);

    if (hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-red-500/10 gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load video</p>
            <Button 
              variant="outline"
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/50">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
          </div>
        )}
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
      </>
    );
  }
);

StoryVideo.displayName = "StoryVideo";