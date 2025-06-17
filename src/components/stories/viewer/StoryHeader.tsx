
import { motion } from "framer-motion";
import { X, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryHeaderProps {
  story: any;
  isOwner: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onAddStory?: () => void;
}

export const StoryHeader = ({
  story,
  isOwner,
  onClose,
  onDelete,
  onAddStory
}: StoryHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-16 left-4 right-4 z-40 flex items-center justify-between"
    >
      {/* Creator info */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-black/60 backdrop-blur-sm border-2 border-white/40">
          {story.creator.avatar_url ? (
            <img
              src={story.creator.avatar_url}
              alt={story.creator.username || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
              {(story.creator.username || 'U').slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-white drop-shadow-lg">
            {story.creator.username || 'User'}
          </p>
          <p className="text-xs text-white/80 drop-shadow-md">
            {new Date(story.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {/* Add Story Button */}
        {onAddStory && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddStory}
            className="w-10 h-10 text-white hover:text-amber-300 hover:bg-amber-300/20 bg-black/70 backdrop-blur-sm border border-white/40"
          >
            <Plus className="w-5 h-5" />
          </Button>
        )}

        {/* Delete button for owner */}
        {isOwner && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="w-10 h-10 text-white hover:text-red-300 hover:bg-red-500/20 bg-black/70 backdrop-blur-sm border border-white/40"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-10 h-10 text-white hover:text-white/90 hover:bg-white/20 bg-black/70 backdrop-blur-sm border border-white/40"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};
