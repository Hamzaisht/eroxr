
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/utils/media/types";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { reportMediaError } from "@/utils/media/mediaMonitoring";
import { mediaOrchestrator } from "@/utils/media/mediaOrchestrator";

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
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const { toast } = useToast();
  
  // Create a stable media ID for this video
  const mediaId = useMemo(() => 
    videoUrl ? mediaOrchestrator.createMediaId({
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      creator_id: creatorId,
      media_type: MediaType.VIDEO
    }) : null,
  [videoUrl, thumbnailUrl, creatorId]);
  
  // Create a stable media source object reference that won't change on every render
  const mediaSource = useMemo(() => {
    if (!videoUrl) return null;
    
    const source = {
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      creator_id: creatorId,
      media_type: MediaType.VIDEO,
      mediaId // Include the mediaId for stability
    };
    
    // Register this media with our orchestrator if it's the current video
    if (isCurrentVideo && !isDeleting) {
      mediaOrchestrator.registerMediaRequest(source);
    }
    
    return source;
  }, [mediaId, isCurrentVideo, isDeleting]);
  
  // Reset retry count when video URL changes
  useEffect(() => {
    setLoadRetries(0);
    setHasStartedPlaying(false);
  }, [videoUrl]);
  
  // Preload video when it's about to be played
  useEffect(() => {
    if (isCurrentVideo && mediaSource && !hasStartedPlaying) {
      // Register this video with high priority
      mediaOrchestrator.registerMediaRequest(mediaSource);
    }
  }, [isCurrentVideo, mediaSource, hasStartedPlaying]);
  
  // Handle video loading success
  const handleVideoLoad = useCallback(() => {
    setHasStartedPlaying(true);
  }, []);
  
  // Handle video error with improved retry mechanism
  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", videoUrl, "mediaId:", mediaId);
    
    setLoadRetries(prev => {
      const newRetryCount = prev + 1;
      
      // Report error for monitoring after multiple failures
      if (newRetryCount >= 2) {
        try {
          reportMediaError(
            videoUrl,
            'load_failure',
            newRetryCount,
            'video',
            'ShortVideoPlayer'
          );
        } catch (error) {
          console.error("Error reporting media error:", error);
        }
        
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
  }, [videoUrl, toast, onError, mediaId]);

  if (isDeleting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Deleting video...</p>
      </div>
    );
  }
  
  if (!videoUrl || !mediaSource) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Video unavailable</p>
      </div>
    );
  }
  
  return (
    <MediaRenderer
      src={mediaSource}
      type={MediaType.VIDEO}
      fallbackSrc={thumbnailUrl} 
      className="h-full w-full object-cover"
      autoPlay={isCurrentVideo}
      onError={handleVideoError}
      onLoad={handleVideoLoad}
      controls={false}
      loop={true}
      muted={false}
      maxRetries={2}
    />
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";
