
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { useRef, useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = ({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const handleMediaLoad = () => {
    console.log("Story media loaded:", story.id);
    setIsLoading(false);
    setHasError(false);
  };

  const handleMediaError = () => {
    console.error("Story media error:", story.id);
    setHasError(true);
    setIsLoading(false);
  };

  const handleRetry = () => {
    console.log("Retrying story load:", story.id);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  // Determine media URL and type
  const mediaItem = {
    media_url: story.media_url,
    video_url: story.video_url,
    content_type: story.content_type || story.media_type,
    media_type: story.media_type || story.content_type,
    creator_id: story.creator_id
  };

  console.log("Rendering story content:", {
    id: story.id,
    mediaType: story.media_type || story.content_type,
    mediaUrl: story.media_url,
    videoUrl: story.video_url,
  });

  return (
    <motion.div
      key={`${story.id}-${retryCount}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full flex items-center justify-center bg-black"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black bg-opacity-90">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-white mb-4">Failed to load story</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 text-white rounded-md"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading
          </button>
        </div>
      )}
      
      <div className="relative w-full h-full z-20">
        <UniversalMedia
          ref={videoRef}
          item={mediaItem}
          className="w-full h-full object-contain"
          autoPlay={!isPaused}
          controls={false}
          muted={true}
          loop={false}
          onLoad={handleMediaLoad}
          onError={handleMediaError}
          onEnded={onNext}
        />
      </div>
    </motion.div>
  );
};
