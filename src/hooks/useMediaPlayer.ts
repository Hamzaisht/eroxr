import { useState, useEffect, useRef } from 'react';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { useToast } from '@/hooks/use-toast';

interface MediaPlayerOptions {
  url: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
}

export const useMediaPlayer = ({
  url,
  autoPlay = false,
  muted = false,
  loop = true,
  onError,
  onEnded,
  onLoadedData
}: MediaPlayerOptions) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const processedUrl = getPlayableMediaUrl(url);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
      
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
      stallTimeoutRef.current = setTimeout(() => {
        setIsStalled(true);
      }, 8000);
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setIsStalled(false);
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
      
      if (onLoadedData) onLoadedData();
      
      if (autoPlay && video.paused) {
        video.play().catch(e => {
          console.warn("Auto-play prevented:", e);
        });
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Video error:", e, "URL:", processedUrl);
      setIsLoading(false);
      setHasError(true);
      
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
      
      if (onError) onError();
    };
    
    const handleEnd = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    const handleStalled = () => {
      setIsStalled(true);
    };
    
    const handlePlaying = () => {
      setIsLoading(false);
      setIsStalled(false);
      setIsPlaying(true);
      
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
    };
    
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnd);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleStalled);
    
    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnd);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleStalled);
      
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
    };
  }, [autoPlay, onError, onEnded, onLoadedData, processedUrl]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsLoading(true);
    setHasError(false);
    video.load();
    
    console.log(`Loading video from: ${processedUrl}`);
    
  }, [processedUrl, retryAttempt]);
  
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Play error:", error);
          toast({
            title: "Video Error",
            description: "Unable to play this video. Please try again.",
            variant: "destructive"
          });
          
          if (onError) onError();
        });
    }
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setIsStalled(false);
    setRetryAttempt(prev => prev + 1);
    
    const video = videoRef.current;
    if (video) {
      const freshUrl = getPlayableMediaUrl(url.split('?')[0]);
      video.src = freshUrl;
      video.load();
    }
  };

  return {
    videoRef,
    isPlaying,
    isMuted,
    isLoading,
    hasError,
    isStalled,
    togglePlay,
    toggleMute,
    handleRetry,
    processedUrl
  };
};
