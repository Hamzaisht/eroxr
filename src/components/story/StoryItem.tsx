
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryItemProps {
  story: Story;
  isStacked?: boolean;
  stackCount?: number;
  onClick: () => void;
  onDelete?: () => void;
}

export const StoryItem = ({ 
  story, 
  isStacked, 
  stackCount = 0,
  onClick,
  onDelete
}: StoryItemProps) => {
  // Determine if it's a video based on content_type or video_url
  const isVideo = story.content_type === 'video' || !!story.video_url;
  const mediaUrl = isVideo ? story.video_url : story.media_url;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    onClick();
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    e.stopPropagation();
    if (onDelete) onDelete();
  };
  
  return (
    <div className="relative">
      {/* Stacked appearance for multiple stories */}
      {isStacked && stackCount > 0 && (
        <>
          <div className="absolute -right-1 -bottom-1 w-24 h-36 rounded-xl bg-luxury-dark/40 transform rotate-3" />
          <div className="absolute -right-2 -bottom-2 w-24 h-36 rounded-xl bg-luxury-dark/60 transform rotate-6" />
        </>
      )}
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-36 rounded-xl overflow-hidden cursor-pointer group border border-luxury-primary/20"
        onClick={handleClick}
      >
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        
        {/* Media preview */}
        {isVideo ? (
          <video
            src={mediaUrl || ''}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        ) : (
          <img
            src={mediaUrl || ''}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* Creator avatar */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
          <Avatar className="w-8 h-8 ring-2 ring-luxury-primary/30 group-hover:ring-luxury-primary/60 transition-all duration-200">
            <AvatarImage src={story.creator?.avatar_url || ''} />
            <AvatarFallback>{story.creator?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </div>

        {/* Delete button for owner */}
        {onDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2 z-20"
          >
            <Button
              variant="destructive"
              size="icon"
              className="w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </motion.div>
        )}

        {/* Username and story count */}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <p className="text-xs text-white/90 truncate text-center font-medium">
            {story.creator?.username || 'Unknown'}
          </p>
          {isStacked && stackCount > 0 && (
            <p className="text-[10px] text-white/70 text-center mt-0.5">
              +{stackCount} more
            </p>
          )}
        </div>

        {/* Video indicator */}
        {isVideo && (
          <div className="absolute top-2 left-2 bg-black/40 rounded-full px-1.5 py-0.5 z-20">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
