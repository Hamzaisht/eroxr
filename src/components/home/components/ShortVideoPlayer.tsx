
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
  
  // Process media URL for safer access
  const safeVideoUrl = videoUrl || null;
  const safeThumbnailUrl = thumbnailUrl || null;
  
  const handleVideoError = useCallback(() => {
    console.error("Video error for short:", safeVideoUrl);
    
    setLoadRetries(prev => {
      const newRetryCount = prev + 1;
      
      // Report error for monitoring after multiple failures
      if (newRetryCount >= 2) {
        reportMediaError(
          safeVideoUrl,
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
  }, [safeVideoUrl, toast, onError]);

  if (isDeleting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80">
        <p className="text-luxury-neutral">Deleting video...</p>
      </div>
    );
  }

  return (
    <MediaRenderer
      src={safeVideoUrl}
      type={MediaType.VIDEO}
      fallbackSrc={safeThumbnailUrl}
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
