import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { VideoControls } from "@/components/video/VideoControls";
import { VideoLoadingState } from "@/components/video/VideoLoadingState";
import { VideoErrorState } from "@/components/video/VideoErrorState";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
  onError?: () => void;
  autoPlay?: boolean;
}

export const VideoPlayer = ({
  url,
  poster,
  className,
  index,
  onIndexChange,
  onError,
  autoPlay = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
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
      if (autoPlay) {
        video.play().catch(console.error);
      }
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

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.src = ''; // Clear source on cleanup
    };
  }, [url, onError, toast, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video playback error:", {
            url,
            error: error.message,
            networkState: videoRef.current?.networkState,
            readyState: videoRef.current?.readyState
          });
          setHasError(true);
          if (onError) onError();
          toast({
            title: "Playback Error",
            description: `Unable to play video: ${error.message}`,
            variant: "destructive",
          });
        });
      }
      if (typeof index !== 'undefined' && onIndexChange) {
        onIndexChange(index);
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
            src={url}
            poster={poster}
            className="w-full h-full object-cover"
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
            onLoadStart={() => console.info("Video load started:", url)}
            onProgress={() => console.info("Video loading in progress:", url)}
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