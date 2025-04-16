
import { useRef, useState, useEffect, useCallback } from 'react';

interface UseVideoPlayerOptions {
  url: string | null;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
}

export const useVideoPlayer = (options: UseVideoPlayerOptions) => {
  const {
    url,
    autoPlay = false,
    muted = false,
    loop = true,
    onError,
    onEnded,
    onLoadedData
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(muted);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Initialize video with new URL
  useEffect(() => {
    const video = videoRef.current;
    if (video && url) {
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded data:', url);
        setDuration(video.duration);
        if (onLoadedData) onLoadedData();
        
        if (autoPlay) {
          video.play().catch(error => {
            console.error('Error auto-playing video:', error);
            if (onError) onError();
          });
        }
      });
      
      video.addEventListener('waiting', () => {
        setIsBuffering(true);
      });
      
      video.addEventListener('canplay', () => {
        setIsBuffering(false);
      });
      
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime);
      });

      return () => {
        video.removeEventListener('loadeddata', () => {});
        video.removeEventListener('waiting', () => {});
        video.removeEventListener('canplay', () => {});
        video.removeEventListener('timeupdate', () => {});
      };
    }
  }, [url, autoPlay, onLoadedData, onError]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing video:', error);
        if (onError) onError();
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [onError]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  return {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    seek
  };
};

export default useVideoPlayer;
