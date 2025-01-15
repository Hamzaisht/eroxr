import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { VideoControls } from "./VideoControls";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  isPPV?: boolean;
  ppvAmount?: number;
  postId?: string;
  hasPurchased?: boolean;
  onPurchase?: () => void;
}

export const VideoPlayer = ({
  url,
  poster,
  className,
  onError,
  isPPV = false,
  ppvAmount = 0,
  hasPurchased = false,
  onPurchase
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.info("Video loaded successfully:", {
        url,
        duration: video.duration,
        readyState: video.readyState
      });
      setIsLoading(false);
      setHasError(false);
      setErrorDetails("");
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      const error = videoElement.error;
      const errorMessage = error ? 
        `Code: ${error.code}, Message: ${error.message}` : 
        'Unknown error';
      
      console.error("Video loading error:", {
        url,
        error: errorMessage,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState
      });
      
      setErrorDetails(errorMessage);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
      
      toast({
        title: "Video Error",
        description: `Failed to load video: ${errorMessage}`,
        variant: "destructive",
      });
    };

    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
    setErrorDetails("");

    // Add crossOrigin attribute
    video.crossOrigin = "anonymous";
    
    // Set video source and load
    video.src = url;
    video.load();

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.src = ''; // Clear source on cleanup
    };
  }, [url, onError, toast]);

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing video:", {
            url,
            error: error.message,
            networkState: videoRef.current?.networkState,
            readyState: videoRef.current?.readyState
          });
          setHasError(true);
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRetry = () => {
    if (!videoRef.current) return;
    console.info("Retrying video load:", url);
    setHasError(false);
    setIsLoading(true);
    setErrorDetails("");
    videoRef.current.load();
  };

  return (
    <div className={cn(
      "relative group overflow-hidden rounded-lg bg-luxury-darker/50",
      className
    )}>
      {isLoading && <VideoLoadingState />}
      
      {hasError ? (
        <VideoErrorState 
          onRetry={handleRetry} 
          errorDetails={errorDetails}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            poster={poster}
            className={cn(
              "w-full h-full object-cover",
              isPPV && !hasPurchased && "blur-xl"
            )}
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
            crossOrigin="anonymous"
          />
          
          {isPPV && !hasPurchased ? (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-lg">
              <Lock className="w-12 h-12 text-luxury-primary animate-pulse" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Premium Content</h3>
                <p className="text-luxury-neutral mb-4">
                  Unlock this content for ${ppvAmount}
                </p>
                <Button
                  onClick={onPurchase}
                  className="bg-luxury-primary hover:bg-luxury-primary/90"
                >
                  Purchase Access
                </Button>
              </div>
            </div>
          ) : (
            <VideoControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              onPlayPause={togglePlay}
              onMuteToggle={toggleMute}
            />
          )}
        </>
      )}
    </div>
  );
};