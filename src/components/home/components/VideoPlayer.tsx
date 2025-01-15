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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log("Video loaded successfully:", url);
      setIsLoading(false);
      setHasError(false);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
      toast({
        title: "Video Error",
        description: "Failed to load video. Please try again later.",
        variant: "destructive",
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
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
          console.error("Error playing video:", error);
          setHasError(true);
          if (onError) onError();
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
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
    setHasError(false);
    setIsLoading(true);
    videoRef.current.load();
  };

  return (
    <div className={cn(
      "relative group overflow-hidden rounded-lg bg-luxury-darker/50",
      className
    )}>
      {isLoading && <VideoLoadingState />}
      
      {hasError ? (
        <VideoErrorState onRetry={handleRetry} />
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