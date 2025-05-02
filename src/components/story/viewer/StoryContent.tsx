
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { useRef, memo, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useStoryMedia } from "@/hooks/useStoryMedia";
import { MediaType } from "@/utils/media/types";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = memo(({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Determine if this is a video or image story
  const isVideo = !!story.video_url || story.media_type === MediaType.VIDEO || story.content_type === 'video';
  const mediaUrl = isVideo ? story.video_url : story.media_url;
  const mediaType = isVideo ? 'video' : 'image';
  
  // Handle story completion
  const handleMediaEnded = useCallback(() => {
    onNext();
  }, [onNext]);
  
  // Use our story media hook to handle media loading
  const {
    url: processedUrl,
    isLoading,
    hasError,
    handleLoad,
    handleError,
    retryLoad
  } = useStoryMedia(mediaUrl, mediaType as 'video' | 'image', isPaused, {
    onComplete: isVideo ? undefined : handleMediaEnded,
    onError: () => {}
  });

  return (
    <motion.div
      key={`${story.id}-${processedUrl}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full flex items-center justify-center bg-black"
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-white mb-4">Failed to load story</p>
          <button
            onClick={retryLoad}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 text-white rounded-md"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading
          </button>
        </div>
      )}
      
      {/* Media content */}
      <div className="relative w-full h-full">
        {isVideo ? (
          <video
            ref={videoRef}
            src={processedUrl || undefined}
            className="w-full h-full object-contain"
            autoPlay={!isPaused && !isLoading && !hasError}
            controls={false}
            onLoadedData={handleLoad}
            onError={handleError}
            onEnded={handleMediaEnded}
            muted={false}
            playsInline
          />
        ) : (
          <img
            src={processedUrl || undefined}
            className="w-full h-full object-contain"
            onLoad={handleLoad}
            onError={handleError}
            alt="Story content"
          />
        )}
      </div>
    </motion.div>
  );
});

StoryContent.displayName = "StoryContent";
