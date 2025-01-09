import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortContentProps {
  short: {
    id: string;
    creator: {
      username: string | null;
      avatar_url: string | null;
    };
    description: string;
    likes: number;
    comments: number;
    has_liked: boolean;
    has_saved: boolean;
  };
  onShare: (shortId: string) => void;
  handleLike: (shortId: string) => Promise<void>;
  handleSave: (shortId: string) => Promise<void>;
  className?: string;
}

export const ShortContent = ({ 
  short,
  onShare,
  handleLike,
  handleSave,
  className = ""
}: ShortContentProps) => {
  return (
    <div className={className}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-end justify-between"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-white/20">
              <AvatarImage src={short.creator.avatar_url ?? ""} />
              <AvatarFallback>
                {short.creator.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium">
              {short.creator.username}
            </span>
          </div>
          <p className="text-white/90 max-w-[80%]">
            {short.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
            onClick={() => handleLike(short.id)}
          >
            <Heart
              className={`h-6 w-6 transition-colors ${
                short.has_liked
                  ? "text-red-500 fill-red-500"
                  : "text-white group-hover:text-red-500"
              }`}
            />
            <span className="sr-only">Like</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
          >
            <MessageCircle className="h-6 w-6 text-white group-hover:text-luxury-primary" />
            <span className="sr-only">Comment</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
            onClick={() => handleSave(short.id)}
          >
            <Bookmark
              className={`h-6 w-6 transition-colors ${
                short.has_saved
                  ? "text-luxury-primary fill-luxury-primary"
                  : "text-white group-hover:text-luxury-primary"
              }`}
            />
            <span className="sr-only">Save</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group"
            onClick={() => onShare(short.id)}
          >
            <Share2 className="h-6 w-6 text-white group-hover:text-luxury-primary" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};