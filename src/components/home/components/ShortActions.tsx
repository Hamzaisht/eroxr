import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortActionsProps {
  shortId: string;
  likes: number;
  comments: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  onLike: (shortId: string) => void;
  onSave: (shortId: string) => void;
  onShare: (shortId: string) => void;
}

export const ShortActions = ({
  shortId,
  likes,
  comments,
  hasLiked,
  hasSaved,
  onLike,
  onSave,
  onShare,
}: ShortActionsProps) => {
  return (
    <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-6">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
          onClick={() => onLike(shortId)}
        >
          <Heart
            className={`h-6 w-6 transition-colors ${
              hasLiked
                ? "text-red-500 fill-red-500"
                : "text-white group-hover:text-red-500"
            }`}
          />
        </Button>
        <span className="mt-1 text-center text-xs text-white block">{likes}</span>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:text-luxury-primary" />
        </Button>
        <span className="mt-1 text-center text-xs text-white block">
          {comments}
        </span>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
          onClick={() => onSave(shortId)}
        >
          <Bookmark
            className={`h-6 w-6 transition-colors ${
              hasSaved
                ? "text-luxury-primary fill-luxury-primary"
                : "text-white group-hover:text-luxury-primary"
            }`}
          />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
          onClick={() => onShare(shortId)}
        >
          <Share2 className="h-6 w-6 text-white group-hover:text-luxury-primary" />
        </Button>
      </motion.div>
    </div>
  );
};