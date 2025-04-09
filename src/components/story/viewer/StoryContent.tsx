
import { motion } from "framer-motion";
import { StoryVideo } from "./StoryVideo";
import { StoryImage } from "./StoryImage";
import { Story } from "@/integrations/supabase/types/story";
import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { getContentType, getMediaUrl } from "@/utils/mediaUtils";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = ({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMediaError, setHasMediaError] = useState(false);
  
  // Use our utility functions for consistent content type and URL detection
  const mediaType = getContentType(story);
  const isVideo = mediaType === 'video';
  const mediaUrl = getMediaUrl(story);
  
  // Log content info for debugging
  console.log("Story content:", { 
    id: story.id, 
    type: isVideo ? 'video' : 'image', 
    contentType: story.content_type,
    mediaType: story.media_type,
    url: mediaUrl
  });

  const handleMediaError = () => {
    console.error("Media failed to load:", mediaUrl);
    setHasMediaError(true);
  };

  // Error fallback component
  const ErrorFallback = ({ message }: { message: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
      <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );

  // If no media URL is available, show error
  if (!mediaUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full flex items-center justify-center bg-black"
      >
        <ErrorFallback message="Media could not be loaded" />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={story.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center bg-black"
    >
      <div className="relative w-full h-full">
        {hasMediaError ? (
          <ErrorFallback message="Media could not be loaded" />
        ) : isVideo ? (
          <StoryVideo
            ref={videoRef}
            videoUrl={mediaUrl}
            onEnded={onNext}
            isPaused={isPaused}
            creatorId={story.creator.id}
            onError={handleMediaError}
          />
        ) : (
          <StoryImage
            mediaUrl={mediaUrl}
            username={story.creator.username}
            isPaused={isPaused}
            creatorId={story.creator.id}
            onError={handleMediaError}
          />
        )}
      </div>
    </motion.div>
  );
};
