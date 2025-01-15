import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { VideoPreview } from "./VideoPreview";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Loader2, Play } from "lucide-react";

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
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative w-24 h-36 overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-primary/20 to-luxury-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Main Content Container */}
        <div className={cn(
          "relative w-full h-full rounded-xl overflow-hidden",
          "ring-2 transition-all duration-300",
          isStacked ? "ring-luxury-primary/60" : "ring-white/20",
          "group-hover:ring-luxury-accent group-hover:ring-opacity-80",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/0 before:via-black/0 before:to-black/80",
          "after:absolute after:inset-0 after:bg-gradient-to-t after:from-luxury-primary/20 after:to-transparent after:opacity-0 after:group-hover:opacity-100 after:transition-opacity after:duration-300"
        )}>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-luxury-darker/60 backdrop-blur-sm">
              <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
            </div>
          ) : hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-luxury-darker/60">
              <span className="text-xs text-red-500">Error</span>
            </div>
          ) : (
            <>
              {story.video_url ? (
                <div className="relative w-full h-full">
                  <VideoPreview
                    videoUrl={story.video_url}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ) : (
                <img
                  src={story.media_url || ''}
                  alt="Story preview"
                  className="w-full h-full object-cover"
                />
              )}
            </>
          )}

          {/* Stack Count Badge */}
          {stackCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 bg-luxury-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            >
              {stackCount}
            </motion.div>
          )}
        </div>
      </div>

      {/* Creator Info */}
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