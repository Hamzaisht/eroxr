import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
      setIsLoading(false);
      setIsPlaying(true);
      video.play().catch((error) => {
        console.error('Video playback error:', error);
        setIsPlaying(false);
      });
    };

    const handleError = (error: any) => {
      console.error('Video preview loading error:', error);
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('play', () => setIsPlaying(true));

    // Force video reload
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('play', () => setIsPlaying(true));
    };
  }, [videoUrl]);

  if (hasError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn("bg-luxury-dark/60 flex items-center justify-center", className)}
      >
        <span className="text-xs text-red-500">Error</span>
      </motion.div>
    );
  }

  return (
    <>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn("bg-luxury-dark/60 flex items-center justify-center", className)}
        >
          <div className="w-6 h-6 border-2 border-luxury-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <motion.video
        ref={videoRef}
        src={videoUrl}
        className={cn(className, isLoading ? "hidden" : "block")}
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 1 : 0 }}
        preload="auto"
        playsInline
        muted
        loop
        poster={`${videoUrl}?x-oss-process=video/snapshot,t_1000,m_fast`}
      />
    </>
  );
};