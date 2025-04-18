import { motion } from "framer-motion";
import { useState } from "react";
import { PlayCircle, ImageIcon } from "lucide-react";
import { Story } from "@/integrations/supabase/types/story";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { UniversalMedia } from "@/components/media/UniversalMedia";

interface StoryItemProps {
  story: Story;
  isStacked?: boolean;
  stackCount?: number;
  onClick: () => void;
  onDelete?: () => void;
}

export const StoryItem = ({
  story,
  isStacked = false,
  stackCount = 0,
  onClick,
  onDelete,
}: StoryItemProps) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [hasMediaError, setHasMediaError] = useState(false);
  
  // Format the timestamp
  const timestamp = new Date(story.created_at);
  const timeAgo = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
  const timeDisplay = timeAgo < 60 
    ? `${timeAgo}m` 
    : `${Math.floor(timeAgo / 60)}h`;
    
  // Determine if story is a video
  const isVideo = 
    story.content_type === "video" || 
    story.media_type === "video" || 
    !!story.video_url;

  const handleLoad = () => {
    setIsMediaLoaded(true);
    setHasMediaError(false);
  };

  const handleError = () => {
    setHasMediaError(true);
    setIsMediaLoaded(false);
  };

  // Create a proper media source object for UniversalMedia
  const mediaItem: MediaSource = {
    media_url: story.media_url,
    video_url: story.video_url,
    media_type: isVideo ? MediaType.VIDEO : MediaType.IMAGE,
    creator_id: story.creator_id,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative w-24 h-36 rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Stacked indicator */}
      {isStacked && stackCount > 0 && (
        <div className="absolute -right-1 -top-1 z-20 bg-luxury-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          +{stackCount}
        </div>
      )}

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />

      {/* Media thumbnail */}
      <div className="w-full h-full bg-luxury-darker">
        {!isMediaLoaded && !hasMediaError && (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/80 z-5 animate-pulse">
            <div className="h-full w-full bg-luxury-dark/50" />
          </div>
        )}
        
        {hasMediaError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker">
            <div className="text-luxury-neutral/50 flex flex-col items-center">
              <ImageIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">No preview</span>
            </div>
          </div>
        ) : (
          <UniversalMedia
            item={mediaItem}
            className="w-full h-full object-cover"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
        
        {/* Media type indicator */}
        {isVideo && isMediaLoaded && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15">
            <PlayCircle className="h-8 w-8 text-white/80" />
          </div>
        )}
      </div>

      {/* User info at bottom */}
      <div className="absolute bottom-2 left-2 right-2 z-20">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5 border border-white/20">
            <AvatarImage 
              src={story.creator?.avatar_url || ''} 
              alt={story.creator?.username || 'User'} 
            />
            <AvatarFallback className="text-[10px]">
              {(story.creator?.username || 'U').substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-white font-medium truncate leading-none">
              {story.creator?.username || 'user'}
            </span>
            <span className="text-[10px] text-white/70">{timeDisplay}</span>
          </div>
        </div>
      </div>
      
      {/* Story view indicator (ring) */}
      <div className="absolute inset-0 border-2 border-luxury-primary rounded-xl" />
    </motion.div>
  );
};
