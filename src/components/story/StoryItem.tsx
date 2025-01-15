import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { VideoPreview } from "./VideoPreview";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

interface StoryItemProps {
  story: Story;
  onClick: () => void;
  isStacked?: boolean;
  stackCount?: number;
}

export const StoryItem = ({ story, onClick, isStacked = false, stackCount = 0 }: StoryItemProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      className="relative group"
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
            "relative w-24 h-24 overflow-hidden cursor-pointer",
            "clip-path-hexagon transform hover:rotate-0 transition-transform duration-300",
            "before:absolute before:inset-0 before:bg-gradient-to-b before:from-luxury-primary/20 before:to-luxury-accent/20",
            "after:absolute after:inset-0 after:border-2 after:border-luxury-primary/30 after:clip-path-hexagon",
            isStacked ? "ring-2 ring-luxury-primary" : "ring-2 ring-white/20",
            "group-hover:ring-luxury-accent group-hover:ring-opacity-60 transition-all duration-300"
          )}
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-luxury-darker/60 backdrop-blur-sm">
              <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
            </div>
          ) : hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-luxury-darker/60">
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

          {stackCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 bg-luxury-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            >
              {stackCount}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </motion.div>
      </AnimatePresence>

      {story.creator && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full"
        >
          <p className="text-xs text-center text-white/80 font-medium truncate max-w-[80px] mx-auto">
            {story.creator.username || 'Anonymous'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};