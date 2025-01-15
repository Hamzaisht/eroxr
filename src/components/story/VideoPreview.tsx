import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, className }: VideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        setHasError(true);
      });
    };

    const handleError = (error: any) => {
      console.error('Video preview loading error:', error);
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

    // Force video reload with new URL
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('play', () => setIsPlaying(true));
      video.src = ''; // Clear source on cleanup
    };
  }, [videoUrl]);

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
        src={videoUrl}
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
        poster={`${videoUrl}?x-oss-process=video/snapshot,t_1000,m_fast`}
      />
    </>
  );
};