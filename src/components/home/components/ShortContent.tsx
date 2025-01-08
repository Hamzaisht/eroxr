import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Short } from "../types/short";
import { ShortActions } from "./ShortActions";

interface ShortContentProps {
  short: Short;
  onShare: (shortId: string) => void;
  handleLike: (shortId: string) => void;
  handleSave: (shortId: string) => void;
}

export const ShortContent = ({ short, onShare, handleLike, handleSave }: ShortContentProps) => {
  return (
    <>
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

      {/* Creator info and description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-4 right-16 z-10 text-white"
      >
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={short.creator.avatar_url ?? ""} />
            <AvatarFallback className="bg-luxury-primary/20">
              {short.creator.username[1]}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold">{short.creator.username}</span>
            <p className="text-sm text-white/80">{short.description}</p>
          </div>
        </div>
      </motion.div>

      <ShortActions
        shortId={short.id}
        likes={short.likes}
        comments={short.comments}
        hasLiked={short.has_liked}
        hasSaved={short.has_saved}
        onLike={handleLike}
        onSave={handleSave}
        onShare={onShare}
      />
    </>
  );
};