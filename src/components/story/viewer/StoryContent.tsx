
import { motion } from "framer-motion";
import { StoryVideo } from "./StoryVideo";
import { StoryImage } from "./StoryImage";
import { Story } from "@/integrations/supabase/types/story";
import { useRef, useState } from "react";
import { AlertCircle, Image, Play } from "lucide-react";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = ({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMediaError, setHasMediaError] = useState(false);
  
  // Determine content type with clear fallback logic
  const mediaType = story.media_type || story.content_type || (story.video_url ? 'video' : 'image');
  const isVideo = mediaType === 'video' || !!story.video_url;
  
  // Determine the media URL to use
  const mediaUrl = isVideo ? story.video_url : story.media_url;
  
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
            <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
            <p className="text-sm text-gray-300">Media could not be loaded</p>
          </div>
        ) : isVideo ? (
          <StoryVideo
            ref={videoRef}
            videoUrl={mediaUrl || ''}
            onEnded={onNext}
            isPaused={isPaused}
            creatorId={story.creator.id}
            onError={handleMediaError}
          />
        ) : (
          <StoryImage
            mediaUrl={mediaUrl || ''}
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
