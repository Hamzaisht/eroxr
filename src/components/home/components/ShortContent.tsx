import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-mobile";

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
  onComment: (shortId: string) => void;
  handleLike: (shortId: string) => Promise<void>;
  handleSave: (shortId: string) => Promise<void>;
  className?: string;
}

export const ShortContent = ({ 
  short,
  onShare,
  onComment,
  handleLike,
  handleSave,
  className = ""
}: ShortContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={className}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-end justify-between"
      >
        <div className={`space-y-4 ${isMobile ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
          <div className="flex items-center gap-3">
            <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} ring-2 ring-white/20`}>
              <AvatarImage src={short.creator.avatar_url ?? ""} />
              <AvatarFallback>
                {short.creator.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">
                  @{short.creator.username}
                </span>
                <Badge variant="secondary" className="bg-luxury-primary/20 text-luxury-primary">
                  Creator
                </Badge>
              </div>
              <span className="text-sm text-white/60">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className={`text-white/90 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed line-clamp-2`}>
            {short.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <Button
            variant="ghost"
            size="icon"
            className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
            onClick={() => handleLike(short.id)}
          >
            <Heart
              className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} transition-all duration-300 ${
                short.has_liked
                  ? "text-red-500 fill-red-500 scale-110"
                  : "text-white group-hover:text-red-500"
              }`}
            />
            <span className="absolute -bottom-6 text-sm font-medium text-white">
              {short.likes}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
            onClick={() => onComment(short.id)}
          >
            <MessageCircle className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-white group-hover:text-luxury-primary`} />
            <span className="absolute -bottom-6 text-sm font-medium text-white">
              {short.comments}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
            onClick={() => handleSave(short.id)}
          >
            <Bookmark
              className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} transition-all duration-300 ${
                short.has_saved
                  ? "text-luxury-primary fill-luxury-primary scale-110"
                  : "text-white group-hover:text-luxury-primary"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
            onClick={() => onShare(short.id)}
          >
            <Share2 className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-white group-hover:text-luxury-primary`} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};