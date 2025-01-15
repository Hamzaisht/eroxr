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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300 ${
        isStacked ? '-ml-4 first:ml-0' : ''
      }`}
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
        {stackCount > 0 && (
          <div className="absolute -right-1 -top-1 bg-luxury-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {stackCount}
          </div>
        )}
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