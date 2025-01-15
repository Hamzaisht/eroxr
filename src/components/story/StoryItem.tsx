import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { VideoPreview } from "./VideoPreview";

interface StoryItemProps {
  story: Story;
  onClick: () => void;
}

export const StoryItem = ({ story, onClick }: StoryItemProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (story.video_url) {
      // Preload video to ensure it's ready when clicked
      const video = new Image();
      video.src = story.video_url;
      video.onload = () => setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [story.video_url]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative mb-2">
        <div className="aspect-[3/4] rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-luxury-dark/20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
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
      </div>
      <div className="text-center">
        <p className="text-sm text-luxury-neutral/60">
          {new Date(story.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
};