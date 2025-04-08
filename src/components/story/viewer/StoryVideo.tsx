
import { forwardRef, useEffect, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';
import { VideoLoadingState } from "@/components/video/VideoLoadingState";
import { VideoErrorState } from "@/components/video/VideoErrorState";

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
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);
    const [retryCount, setRetryCount] = useState(0);
    
    // Add cache buster to URL to prevent stale cache issues
    const getUrlWithCacheBuster = (baseUrl: string) => {
      if (!baseUrl) return '';
      const timestamp = Date.now();
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}cb=${timestamp}`;
    };

    const handleError = useCallback((error?: any) => {
      console.error("Video loading error:", videoUrl, error);
      setHasError(true);
      setIsLoading(false);
      const errorMsg = error?.message || "Failed to play video. Please try again.";
      setErrorDetails(errorMsg);
      
      toast({
        title: "Video Error",
        description: errorMsg,
        variant: "destructive",
      });
    }, [toast, videoUrl]);

    const handleRetry = useCallback(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        setHasError(false);
        setIsLoading(true);
        setRetryCount(count => count + 1);
        
        // Add cache buster to force reload
        const cacheBuster = getUrlWithCacheBuster(videoUrl);
        videoElement.current.src = cacheBuster;
        videoElement.current.load();
        videoElement.current.play().catch(handleError);
      }
    }, [ref, videoUrl, handleError]);

    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        const handleVideoLoaded = () => {
          setIsLoading(false);
          setHasError(false);
        };
        
        const handleVideoError = (e: Event) => {
          handleError((e.target as HTMLVideoElement).error);
        };
        
        // Set up video with cache buster to avoid stale cache
        setIsLoading(true);
        const cacheBustedUrl = getUrlWithCacheBuster(videoUrl);
        videoElement.current.src = cacheBustedUrl;
        
        videoElement.current.addEventListener('loadeddata', handleVideoLoaded);  // Use correct event name
        videoElement.current.addEventListener('error', handleVideoError);
        
        if (!isPaused) {
          videoElement.current.play().catch(error => {
            console.error("Error playing video:", error);
            handleError(error);
          });
        } else {
          videoElement.current.pause();
        }
        
        return () => {
          if (videoElement.current) {
            videoElement.current.removeEventListener('loadeddata', handleVideoLoaded);  // Use correct event name
            videoElement.current.removeEventListener('error', handleVideoError);
          }
        };
      }
    }, [isPaused, ref, handleError, videoUrl, retryCount]);

    useEffect(() => {
      getUsernameForWatermark(creatorId).then(name => {
        setWatermarkUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }, [creatorId]);

    if (hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
          <VideoErrorState 
            message="Failed to load story video" 
            onRetry={handleRetry}
          />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
        <div className="relative w-full h-full max-w-[500px] mx-auto">
          {isLoading && <VideoLoadingState />}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={ref}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted={false}
              controls={false}
              onEnded={onEnded}
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
