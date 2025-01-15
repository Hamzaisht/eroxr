import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, className }: VideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setIsLoading(false));
      video.addEventListener('error', () => {
        console.error('Video preview loading error:', videoUrl);
        setHasError(true);
        setIsLoading(false);
      });

      return () => {
        video.removeEventListener('loadeddata', () => setIsLoading(false));
        video.removeEventListener('error', () => setHasError(true));
      };
    }
  }, [videoUrl]);

  if (hasError) {
    return (
      <div className={cn("bg-black/20 flex items-center justify-center", className)}>
        <span className="text-xs text-red-500">Error</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={cn("bg-black/20 flex items-center justify-center", className)}>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        className={cn(className, isLoading ? "hidden" : "block")}
        preload="metadata"
        playsInline
        muted
        loop
        poster={`${videoUrl}?x-oss-process=video/snapshot,t_1000,m_fast`}
      />
    </>
  );
};