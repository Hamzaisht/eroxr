import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { VideoPreview } from "./VideoPreview";
import { cn } from "@/lib/utils";

interface StoryItemProps {
  story: Story;
  onClick: () => void;
  isStacked?: boolean;
  stackCount?: number;
}

export const StoryItem = ({ story, onClick, isStacked = false, stackCount = 0 }: StoryItemProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        if (story.video_url) {
          const video = document.createElement('video');
          video.src = story.video_url;
          await new Promise((resolve, reject) => {
            video.onloadeddata = resolve;
            video.onerror = reject;
          });
        } else if (story.media_url) {
          const img = new Image();
          img.src = story.media_url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        }
      } catch (error) {
        console.error('Media loading error:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [story.video_url, story.media_url]);

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={story.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "relative w-20 aspect-square rounded-full overflow-hidden cursor-pointer",
            "ring-2 ring-offset-2 ring-offset-background",
            isStacked ? "ring-primary" : "ring-neutral-400/20",
          )}
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-black/20">
              <span className="text-xs text-red-500">Error</span>
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

          {/* Stacked indicator */}
          {stackCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 bg-primary text-background text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            >
              {stackCount}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Username */}
      {story.creator && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center mt-2 text-neutral-400 font-medium truncate max-w-[80px]"
        >
          {story.creator.username || 'Anonymous'}
        </motion.p>
      )}
    </motion.div>
  );
};