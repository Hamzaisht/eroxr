
import { useRef, useState, useEffect } from 'react';

interface VideoPlayerOptions {
  url: string | null;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onLoadedData?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const useVideoPlayer = ({
  url,
  autoPlay = false,
  muted = true,
  loop = false,
  onLoadedData,
  onError,
  onEnded
}: VideoPlayerOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Reset state when URL changes
  useEffect(() => {
    setHasError(false);
    setIsBuffering(false);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [url]);

  // Set up video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    const handleLoadedData = () => {
      setHasError(false);
      setDuration(video.duration);
      if (autoPlay) {
        video.play().catch(console.error);
        setIsPlaying(true);
      }
      if (onLoadedData) onLoadedData();
    };

    const handleError = () => {
      console.error('Video error with URL:', url);
      setHasError(true);
      setIsPlaying(false);
      if (onError) onError();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Apply initial settings
    video.muted = muted;
    video.loop = loop;

    // Clean up event listeners
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [url, autoPlay, muted, loop, onLoadedData, onError, onEnded]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Seek to specific time
  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
  };

  return {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    hasError,
    progress,
    duration,
    currentTime,
    togglePlay,
    toggleMute,
    seek,
  };
};
