
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
  const isVideo = !!story.video_url;

  return (
    <motion.div
      key={story.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="relative w-full h-full">
        {isVideo ? (
          <StoryVideo
            ref={videoRef}
            videoUrl={story.video_url!}
            onEnded={onNext}
            isPaused={isPaused}
          />
        ) : (
          <StoryImage
            mediaUrl={story.media_url || ''}
            username={story.creator.username}
            isPaused={isPaused}
          />
        )}
      </div>
    </motion.div>
  );
};
