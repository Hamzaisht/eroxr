
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { useToast } from "@/hooks/use-toast";

interface ShortVideoPlayerProps {
  videoUrl: string | null;
  thumbnailUrl?: string;
  creatorId?: string;
  isCurrentVideo: boolean;
  isDeleting?: boolean;
  onError: () => void;
}

export const ShortVideoPlayer = memo(({ 
  videoUrl, 
  thumbnailUrl, 
  creatorId, 
  isCurrentVideo,
  isDeleting, 
  onError 
}: ShortVideoPlayerProps) => {
  const [videoError, setVideoError] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const [isMediaAvailable, setIsMediaAvailable] = useState(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  
  // Process video URL once
  const processedUrl = videoUrl ? getPlayableMediaUrl({ video_url: videoUrl }) : null;
  const processedThumbnail = thumbnailUrl ? 
    getPlayableMediaUrl({ media_url: thumbnailUrl }) : undefined;
  
  // Check if media is available
  useEffect(() => {
    if (!processedUrl) {
      setIsMediaAvailable(false);
    } else {
      setIsMediaAvailable(true);
      setVideoError(false);
      setLoadRetries(0);
    }
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [processedUrl]);

  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", videoUrl);
    
    setVideoError(true);
    
    if (loadRetries < 2) {
      // Try to reload the video after a short delay
      setLoadRetries(prev => prev + 1);
      retryTimeoutRef.current = setTimeout(() => {
        setVideoError(false);
      }, 2000);
    } else {
      // After multiple retries, show a toast
      toast({
        title: "Video loading error",
        description: "Unable to load this video. You may want to try again later.",
        variant: "destructive"
      });
      onError();
    }
  }, [videoUrl, loadRetries, toast, onError]);

  if (!isMediaAvailable || !processedUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker">
        <p className="text-luxury-neutral/70">This video is not available</p>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Deleting video...</p>
      </div>
    );
  }

  return (
    <VideoPlayer
      url={processedUrl}
      poster={processedThumbnail}
      className="h-full w-full object-cover"
      autoPlay={isCurrentVideo && !videoError}
      onError={handleVideoError}
      creatorId={creatorId}
    />
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";
