import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { VideoPreview } from "./VideoPreview";

interface StoryItemProps {
  story: Story;
  onClick: () => void;
  isStacked?: boolean;
  stackCount?: number;
}

export const StoryItem = ({ story, onClick, isStacked = false, stackCount = 0 }: StoryItemProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (story.video_url) {
      const video = document.createElement('video');
      video.src = story.video_url;
      video.onloadeddata = () => setIsLoading(false);
    } else {
      const img = new Image();
      img.src = story.media_url || '';
      img.onload = () => setIsLoading(false);
    }
  }, [story.video_url, story.media_url]);

  return (
    <div className="relative" onClick={onClick}>
      <motion.div
        className={`relative w-20 rounded-full border-2 ${
          isStacked ? 'border-luxury-primary' : 'border-luxury-neutral/20'
        } cursor-pointer overflow-hidden group`}
      >
        <div className="relative aspect-square">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-luxury-dark/20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-primary"></div>
            </div>
          ) : (
            story.video_url ? (
              <VideoPreview
                videoUrl={story.video_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={story.media_url || ''}
                alt="Story preview"
                className="w-full h-full object-cover"
              />
            )
          )}
        </div>
      </motion.div>

      {stackCount > 0 && (
        <div className="absolute -right-1 -top-1 bg-luxury-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {stackCount}
        </div>
      )}

      {story.creator && (
        <p className="text-xs text-center mt-2 text-luxury-neutral/80 truncate max-w-[80px]">
          {story.creator.username || 'Anonymous'}
        </p>
      )}
    </div>
  );
};