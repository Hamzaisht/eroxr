
import { useState, useEffect, RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseVideoPlayerProps {
  url: string;
  videoRef: RefObject<HTMLVideoElement>;
  isCurrentVideo: boolean;
  onIndexChange?: (index: number) => void;
  onMuteChange: (muted: boolean) => void;
  index?: number;
  onError?: () => void;
  onEnded?: () => void;
}

export const useVideoPlayer = ({
  url,
  videoRef,
  isCurrentVideo,
  onIndexChange,
  onMuteChange,
  index,
  onError,
  onEnded
}: UseVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsBuffering(false);
      console.log("Video loaded successfully:", url);
      if (video.paused && isCurrentVideo) {
        video.play().catch(console.error);
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setIsBuffering(false);
      if (onError) onError();
    };

    const handleVideoEnded = () => {
      if (onEnded) onEnded();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleVideoEnded);

    // Reset video state when URL changes
    setIsPlaying(false);
    setIsLoaded(false);
    setIsBuffering(true);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleVideoEnded);
    };
  }, [url, onError, isCurrentVideo, onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isCurrentVideo) {
      video.play().catch(console.error);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isCurrentVideo, videoRef]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Video playback error:', error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
      });
      if (typeof index !== 'undefined' && onIndexChange) {
        onIndexChange(index);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    onMuteChange(!videoRef.current.muted);
  };

  return {
    isPlaying,
    setIsPlaying,
    isLoaded,
    isBuffering,
    togglePlay,
    toggleMute
  };
};
