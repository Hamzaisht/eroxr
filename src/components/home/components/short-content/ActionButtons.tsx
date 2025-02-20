
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ActionButtonsProps {
  shortId: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  hasSaved: boolean;
  onLike: (shortId: string) => Promise<void>;
  onComment: (shortId: string) => void;
  onSave: (shortId: string) => Promise<void>;
  onShare: (shortId: string) => void;
}

export const ActionButtons = ({
  shortId,
  likes,
  comments,
  hasLiked,
  hasSaved,
  onLike,
  onComment,
  onSave,
  onShare,
}: ActionButtonsProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="icon"
        className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onLike(shortId)}
      >
        <Heart
          className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} transition-all duration-300 ${
            hasLiked
              ? "text-red-500 fill-red-500 scale-110"
              : "text-white group-hover:text-red-500"
          }`}
        />
        <span className="absolute -bottom-6 text-sm font-medium text-white">
          {likes}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onComment(shortId)}
      >
        <MessageCircle className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-white group-hover:text-luxury-primary`} />
        <span className="absolute -bottom-6 text-sm font-medium text-white">
          {comments}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onSave(shortId)}
      >
        <Bookmark
          className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} transition-all duration-300 ${
            hasSaved
              ? "text-luxury-primary fill-luxury-primary scale-110"
              : "text-white group-hover:text-luxury-primary"
          }`}
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onShare(shortId)}
      >
        <Share2 className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-white group-hover:text-luxury-primary`} />
      </Button>
    </div>
  );
};
