
import { motion } from "framer-motion";
import { StoryVideo } from "./StoryVideo";
import { StoryImage } from "./StoryImage";
import { Story } from "@/integrations/supabase/types/story";
import { useRef } from "react";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = ({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Determine content type - ensure we check both properties
  const isVideo = story.content_type === 'video' || 
                 (story.media_type && story.media_type === 'video') || 
                 !!story.video_url;
                 
  const mediaUrl = isVideo ? story.video_url! : story.media_url!;
  
  // Log content info for debugging
  console.log("Story content:", { 
    id: story.id, 
    type: isVideo ? 'video' : 'image', 
    contentType: story.content_type,
    mediaType: story.media_type,
    url: mediaUrl
  });

  return (
    <motion.div
      key={story.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center bg-black"
    >
      <div className="relative w-full h-full">
        {isVideo ? (
          <StoryVideo
            ref={videoRef}
            videoUrl={mediaUrl}
            onEnded={onNext}
            isPaused={isPaused}
            creatorId={story.creator.id}
          />
        ) : (
          <StoryImage
            mediaUrl={mediaUrl}
            username={story.creator.username}
            isPaused={isPaused}
            creatorId={story.creator.id}
          />
        )}
      </div>
    </motion.div>
  );
};
