
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
  return (
    <div className="relative">
      {isStacked && stackCount > 0 && (
        <>
          <div className="absolute -right-1 -bottom-1 w-24 h-36 rounded-xl bg-luxury-dark/40 transform rotate-3" />
          <div className="absolute -right-2 -bottom-2 w-24 h-36 rounded-xl bg-luxury-dark/60 transform rotate-6" />
        </>
      )}
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-36 rounded-xl overflow-hidden cursor-pointer group"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        
        {story.video_url ? (
          <video
            src={story.video_url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        ) : (
          <img
            src={story.media_url || ''}
            alt=""
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
          <Avatar className="w-8 h-8 ring-2 ring-luxury-primary/20 group-hover:ring-luxury-primary/40 transition-all duration-200">
            <AvatarImage src={story.creator.avatar_url || ''} />
            <AvatarFallback>{story.creator.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

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
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </motion.div>
        )}

        <div className="absolute bottom-2 left-2 right-2 z-20">
          <p className="text-xs text-white/90 truncate text-center">
            {story.creator.username}
          </p>
          {isStacked && stackCount > 0 && (
            <p className="text-[10px] text-white/60 text-center mt-0.5">
              +{stackCount} more
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
