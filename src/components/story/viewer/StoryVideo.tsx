
import { forwardRef, useEffect, useCallback, useState, useRef } from "react";
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
    const [isStalled, setIsStalled] = useState(false);
    const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
    const MAX_RETRIES = 2;
    const STALL_TIMEOUT = 8000; // 8 seconds
    
    // Add cache buster to URL to prevent stale cache issues
    const getUrlWithCacheBuster = (baseUrl: string) => {
      if (!baseUrl) return '';
      const timestamp = Date.now();
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}cb=${timestamp}&r=${Math.random().toString(36).substring(2, 9)}`;
    };

    const handleError = useCallback((error?: any) => {
      console.error("Video loading error:", videoUrl, error);
      setHasError(true);
      setIsLoading(false);
      setIsStalled(false);
      const errorMsg = error?.message || "Failed to play video. Please try again.";
      setErrorDetails(errorMsg);
      
      toast({
        title: "Video Error",
        description: errorMsg,
        variant: "destructive",
      });
    }, [toast, videoUrl]);

    const startStallTimer = useCallback(() => {
      // Clear any existing timer first
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
      }
      
      // Set a new timer for stall detection
      const timer = setTimeout(() => {
        if (isLoading) {
          console.warn("Story video loading stalled:", videoUrl);
          setIsStalled(true);
          
          if (retryCount < MAX_RETRIES) {
            handleRetry();
          } else {
            setHasError(true);
            setIsLoading(false);
            setErrorDetails("Video loading timed out. Please try again.");
          }
        }
      }, STALL_TIMEOUT);
      
      stallTimerRef.current = timer;
    }, [isLoading, retryCount, videoUrl]);

    const handleRetry = useCallback(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        setHasError(false);
        setIsLoading(true);
        setIsStalled(false);
        setRetryCount(count => count + 1);
        
        // Add cache buster to force reload
        const cacheBuster = getUrlWithCacheBuster(videoUrl);
        videoElement.current.src = cacheBuster;
        videoElement.current.load();
        
        // Start a new stall timer
        startStallTimer();
        
        // Attempt to play
        videoElement.current.play().catch(handleError);
      }
    }, [ref, videoUrl, handleError, startStallTimer]);

    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current) {
        const handleVideoLoaded = () => {
          // Clear stall timer
          if (stallTimerRef.current) {
            clearTimeout(stallTimerRef.current);
          }
          
          setIsLoading(false);
          setIsStalled(false);
          setHasError(false);
          
          console.log("Story video loaded successfully:", videoUrl);
        };
        
        const handleVideoError = (e: Event) => {
          // Clear stall timer
          if (stallTimerRef.current) {
            clearTimeout(stallTimerRef.current);
          }
          
          // Auto retry up to MAX_RETRIES times
          if (retryCount < MAX_RETRIES) {
            console.log(`Auto-retrying story video load (${retryCount + 1}/${MAX_RETRIES})...`);
            setRetryCount(prev => prev + 1);
            
            // Try with cache buster
            const cacheBustedUrl = getUrlWithCacheBuster(videoUrl);
            videoElement.current.src = cacheBustedUrl;
            videoElement.current.load();
            
            // Start a new stall timer
            startStallTimer();
            return;
          }
          
          handleError((e.target as HTMLVideoElement).error);
        };
        
        const handleStalled = () => {
          console.warn("Story video playback stalled:", videoUrl);
          setIsStalled(true);
          
          if (retryCount < MAX_RETRIES) {
            // Auto retry if stalled during playback
            handleRetry();
          }
        };
        
        // Reset states
        setIsLoading(true);
        setHasError(false);
        setIsStalled(false);
        
        // Set up video with cache buster to avoid stale cache
        const cacheBustedUrl = getUrlWithCacheBuster(videoUrl);
        videoElement.current.src = cacheBustedUrl;
        
        videoElement.current.addEventListener('loadeddata', handleVideoLoaded);
        videoElement.current.addEventListener('error', handleVideoError);
        videoElement.current.addEventListener('stalled', handleStalled);
        
        // Start the stall timer
        startStallTimer();
        
        if (!isPaused) {
          videoElement.current.play().catch(error => {
            console.error("Error playing video:", error);
            handleError(error);
          });
        } else {
          videoElement.current.pause();
        }
        
        return () => {
          // Clear stall timer
          if (stallTimerRef.current) {
            clearTimeout(stallTimerRef.current);
          }
          
          if (videoElement.current) {
            videoElement.current.removeEventListener('loadeddata', handleVideoLoaded);
            videoElement.current.removeEventListener('error', handleVideoError);
            videoElement.current.removeEventListener('stalled', handleStalled);
          }
        };
      }
    }, [isPaused, ref, handleError, videoUrl, startStallTimer, retryCount, handleRetry]);

    useEffect(() => {
      getUsernameForWatermark(creatorId).then(name => {
        setWatermarkUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }, [creatorId]);

    useEffect(() => {
      return () => {
        // Clear stall timer on component unmount
        if (stallTimerRef.current) {
          clearTimeout(stallTimerRef.current);
        }
      };
    }, []);

    if (hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
          <VideoErrorState 
            message={errorDetails || "Failed to load story video"} 
            onRetry={handleRetry}
          />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
        <div className="relative w-full h-full max-w-[500px] mx-auto">
          {(isLoading || isStalled) && (
            <VideoLoadingState isStalled={isStalled} />
          )}
          
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
