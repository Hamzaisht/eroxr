
import { useState, useEffect, memo, useCallback } from "react";
import { useMedia } from "@/hooks/useMedia";
import { useToast } from "@/hooks/use-toast";
import { VideoPlayer } from "@/components/video/VideoPlayer";

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
  const [loadRetries, setLoadRetries] = useState(0);
  const [isMediaAvailable, setIsMediaAvailable] = useState(true);
  const { toast } = useToast();
  
  // Process media URLs using our hook
  const { 
    url: processedUrl, 
    isError: videoError,
    retry: retryVideoLoad
  } = useMedia(videoUrl ? { video_url: videoUrl } : null);
  
  const { 
    url: processedThumbnail 
  } = useMedia(thumbnailUrl ? { media_url: thumbnailUrl } : null);
  
  // Check if media is available
  useEffect(() => {
    if (!processedUrl) {
      setIsMediaAvailable(false);
    } else {
      setIsMediaAvailable(true);
      setLoadRetries(0);
    }
  }, [processedUrl]);

  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", videoUrl);
    
    if (loadRetries < 2) {
      // Try to reload the video after a short delay
      setLoadRetries(prev => prev + 1);
      retryVideoLoad();
    } else {
      // After multiple retries, show a toast
      toast({
        title: "Video loading error",
        description: "Unable to load this video. You may want to try again later.",
        variant: "destructive"
      });
      onError();
    }
  }, [videoUrl, loadRetries, toast, onError, retryVideoLoad]);

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
      poster={processedThumbnail || undefined}
      className="h-full w-full object-cover"
      autoPlay={isCurrentVideo && !videoError}
      onError={handleVideoError}
      creatorId={creatorId}
    />
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";
