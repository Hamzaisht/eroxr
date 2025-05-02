
import { useState, useEffect, memo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/utils/media/types";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { reportMediaError } from "@/utils/media/mediaMonitoring";

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
  const { toast } = useToast();
  
  // Handle video error with improved retry mechanism
  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", videoUrl);
    
    setLoadRetries(prev => {
      const newRetryCount = prev + 1;
      
      // Report error for monitoring after multiple failures
      if (newRetryCount >= 2) {
        reportMediaError(
          videoUrl,
          'load_failure',
          newRetryCount,
          'video',
          'ShortVideoPlayer'
        );
        
        // Show a toast after multiple retries
        toast({
          title: "Video loading error",
          description: "Unable to load this video. You may want to try again later.",
          variant: "destructive"
        });
        
        // Notify parent component
        onError();
      }
      
      return newRetryCount;
    });
  }, [videoUrl, toast, onError]);

  // Reset retry count when video URL changes
  useEffect(() => {
    setLoadRetries(0);
  }, [videoUrl]);

  if (isDeleting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Deleting video...</p>
      </div>
    );
  }

  // Create media source object for MediaRenderer
  const mediaSource = videoUrl ? {
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    creator_id: creatorId,
    media_type: "video" as MediaType
  } : null;

  console.log("Rendering ShortVideoPlayer with:", { videoUrl, thumbnailUrl, isCurrentVideo });

  return (
    <MediaRenderer
      src={mediaSource}
      type="video" as MediaType
      fallbackSrc={thumbnailUrl} 
      className="h-full w-full object-cover"
      autoPlay={isCurrentVideo}
      onError={handleVideoError}
      controls={false}
      loop={true}
      muted={false}
      maxRetries={2}
    />
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";
