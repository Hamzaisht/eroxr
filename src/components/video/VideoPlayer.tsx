import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { VideoControls } from "./VideoControls";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  isPPV?: boolean;
  ppvAmount?: number;
  hasPurchased?: boolean;
  onPurchase?: () => void;
  title?: string;
}

export const VideoPlayer = ({
  url,
  poster,
  className,
  onError,
  isPPV = false,
  ppvAmount = 0,
  hasPurchased = false,
  onPurchase,
  title = "Video content"
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
        description: "Failed to load video. Please try again.",
        variant: "destructive",
      });
    };

    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
    setErrorDetails("");

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
          console.error("Error playing video:", error);
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

  return (
    <div 
      className={cn(
        "relative group overflow-hidden rounded-lg bg-luxury-darker/50",
        className
      )}
      role="region"
      aria-label={title}
    >
      <VisuallyHidden>
        <h2 id="video-title">{title}</h2>
      </VisuallyHidden>

      {isLoading && <VideoLoadingState />}
      
      {hasError ? (
        <VideoErrorState 
          onRetry={() => {
            setIsLoading(true);
            setHasError(false);
            if (videoRef.current) {
              videoRef.current.load();
            }
          }}
          errorDetails={errorDetails}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={url}
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
            aria-labelledby="video-title"
          />
          
          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayPause={togglePlay}
            onMuteToggle={toggleMute}
          />
        </>
      )}
    </div>
  );
};