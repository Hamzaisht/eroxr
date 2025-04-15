
import { useState, useEffect, useRef, RefObject, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseVideoPlayerProps {
  url: string | null;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
}

interface UseVideoPlayerResult {
  videoRef: RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  isMuted: boolean;
  isLoaded: boolean;
  isBuffering: boolean;
  hasError: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  restart: () => void;
  seekTo: (time: number) => void;
}

/**
 * Hook to handle video player functionality
 */
export const useVideoPlayer = ({
  url,
  autoPlay = false,
  muted = false,
  loop = true,
  onError,
  onEnded,
  onLoadedData
}: UseVideoPlayerProps): UseVideoPlayerResult => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Set up event handlers for the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;
    
    const handleLoadedData = () => {
      console.log(`Video loaded: ${url}`);
      setIsLoaded(true);
      setIsBuffering(false);
      if (onLoadedData) onLoadedData();
      
      if (autoPlay && video.paused) {
        video.play().catch(e => {
          console.warn("Auto-play prevented:", e);
        });
      }
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleError = (e: Event) => {
      console.error("Video error:", e, url);
      setHasError(true);
      setIsBuffering(false);
      if (onError) onError();
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    // Reset video state when URL changes
    setIsLoaded(false);
    setIsBuffering(true);
    setHasError(false);
    
    // Set muted state
    video.muted = isMuted;
    
    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    
    // Clean up event listeners
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [url, autoPlay, isMuted, onError, onEnded, onLoadedData]);
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(error => {
        console.error('Video playback error:', error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      video.pause();
    }
    setIsPlaying(!video.paused);
  }, [toast]);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);
  
  // Restart video
  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    video.play().catch(console.error);
    setIsPlaying(true);
  }, []);
  
  // Seek to a specific time
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
  }, []);

  return {
    videoRef,
    isPlaying,
    isMuted,
    isLoaded,
    isBuffering,
    hasError,
    togglePlay,
    toggleMute,
    restart,
    seekTo
  };
};
