
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { useRef, useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UniversalMedia } from "@/components/media/UniversalMedia";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = ({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  // Add a state to track if the story has been processed
  const [isMediaProcessed, setIsMediaProcessed] = useState(false);

  // Process the story media item to ensure we have correct media type and URL
  const mediaItem = {
    media_url: story.media_url,
    video_url: story.video_url,
    media_type: story.media_type || story.content_type,
    content_type: story.content_type || story.media_type,
    id: story.id,
    creator_id: story.creator_id
  };
  
  // Debug logging
  useEffect(() => {
    console.log("Story content being rendered:", { 
      id: story.id, 
      type: story.content_type || story.media_type,
      mediaUrl: story.media_url,
      videoUrl: story.video_url
    });
    
    // Mark the media as processed after a short delay
    setTimeout(() => {
      setIsMediaProcessed(true);
    }, 500);
  }, [story.id]);

  // Handle retry mechanism
  const handleRetry = () => {
    setHasMediaError(false);
    setRetryCount(prev => prev + 1);
    
    // Show toast for retry attempt
    toast({
      title: "Retrying...",
      description: "Attempting to load story content again",
    });
  };

  const handleMediaError = () => {
    console.error("Media failed to load:", story);
    setHasMediaError(true);
    
    toast({
      title: "Media Error",
      description: "Failed to load story content. You can try again.",
      variant: "destructive"
    });
  };

  // Error fallback component
  const ErrorFallback = ({ message }: { message: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
      <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
      <p className="text-sm text-gray-300 mb-4">{message}</p>
      <button 
        onClick={handleRetry}
        className="px-4 py-2 bg-luxury-primary rounded-md hover:bg-luxury-primary/80 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <motion.div
      key={`${story.id}-${retryCount}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center bg-black"
    >
      <div className="relative w-full h-full">
        {hasMediaError ? (
          <ErrorFallback message="Media could not be loaded. Tap to retry." />
        ) : (
          <UniversalMedia
            ref={videoRef}
            item={mediaItem}
            className="w-full h-full"
            onError={handleMediaError}
            autoPlay={!isPaused}
            controls={false}
            onClick={onNext}
            key={`${story.id}-media-${retryCount}`}
          />
        )}
      </div>
    </motion.div>
  );
};
