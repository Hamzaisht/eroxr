
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, className }: VideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const MAX_RETRIES = 2;

  // Add cache buster to URL to prevent stale cache issues
  const getUrlWithCacheBuster = (baseUrl: string) => {
    if (!baseUrl) return '';
    const timestamp = Date.now();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}cb=${timestamp}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      console.info('Video preview loaded successfully:', videoUrl);
      setIsLoading(false);
      setIsPlaying(true);
      video.play().catch((error) => {
        console.error('Video playback error:', error);
        setIsPlaying(false);
      });
    };

    const handleError = (error: any) => {
      console.error('Video preview loading error:', error);
      
      // Auto retry up to MAX_RETRIES times
      if (retryCount < MAX_RETRIES) {
        console.log(`Auto-retrying video load (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        
        // Try with cache buster
        const cacheBuster = getUrlWithCacheBuster(videoUrl);
        video.src = cacheBuster;
        video.load();
        return;
      }
      
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
    };

    // Reset states when video URL changes
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('play', () => setIsPlaying(true));

    // Add cache buster to prevent stale cache issues
    const cacheBuster = getUrlWithCacheBuster(videoUrl);
    video.src = cacheBuster;

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('play', () => setIsPlaying(true));
      video.src = ''; // Clear source on cleanup
    };
  }, [videoUrl, retryCount]);

  const handleRetry = () => {
    if (videoRef.current) {
      setIsLoading(true);
      setHasError(false);
      setRetryCount(0);
      // Add cache buster to force reload
      const cacheBuster = getUrlWithCacheBuster(videoUrl);
      videoRef.current.src = cacheBuster;
      videoRef.current.load();
    }
  };

  if (hasError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "bg-red-500/10 flex flex-col items-center justify-center gap-2",
          className
        )}
      >
        <AlertCircle className="w-6 h-6 text-red-500" />
        <span className="text-xs text-red-500">Failed to load video</span>
        <button 
          onClick={handleRetry}
          className="flex items-center text-xs gap-1 px-2 py-1 mt-1 bg-luxury-dark/50 hover:bg-luxury-dark rounded text-luxury-neutral/80"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "bg-luxury-dark/60 flex items-center justify-center",
            className
          )}
        >
          <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
        </motion.div>
      )}
      <motion.video
        ref={videoRef}
        className={cn(
          className,
          isLoading ? "hidden" : "block",
          "object-cover"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 1 : 0 }}
        preload="metadata"
        playsInline
        muted
        loop
      />
    </>
  );
};
