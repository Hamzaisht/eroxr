
import { useState, useEffect, RefObject, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseVideoPlayerOptions {
  url: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
}

export const useVideoPlayer = ({
  url,
  autoPlay = false,
  muted = true,
  loop = true,
  onError,
  onEnded,
  onLoadedData
}: UseVideoPlayerOptions) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Initialize and handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Set initial state
    video.muted = isMuted;
    video.loop = loop;
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setIsBuffering(false);
      console.log("Video loaded successfully:", url);
      
      if (autoPlay) {
        video.play().catch(err => {
          console.warn("Autoplay prevented:", err);
          // Most browsers prevent autoplay with sound
          if (!isMuted) {
            video.muted = true;
            setIsMuted(true);
            video.play().catch(console.error);
          }
        });
      }
      
      if (onLoadedData) onLoadedData();
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
      
      if (onError) onError();
      
      toast({
        title: "Video Error",
        description: "Unable to play this video. Please try again.",
        variant: "destructive",
      });
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    // Add event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);
    
    // Clean up
    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);
    };
  }, [url, autoPlay, isMuted, loop, onError, onEnded, onLoadedData, toast]);
  
  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Video playback error:', error);
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return {
    videoRef,
    isPlaying,
    isMuted,
    isLoading,
    isBuffering,
    hasError,
    togglePlay,
    toggleMute
  };
};
