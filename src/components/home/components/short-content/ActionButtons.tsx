
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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const getButtonSize = () => {
    if (isMobile) return 'h-10 w-10';
    if (isTablet) return 'h-12 w-12';
    return 'h-14 w-14';
  };

  const getIconSize = () => {
    if (isMobile) return 'h-5 w-5';
    if (isTablet) return 'h-6 w-6';
    return 'h-7 w-7';
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <Button
        variant="ghost"
        size="icon"
        className={`${buttonSize} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onLike(shortId)}
      >
        <Heart
          className={`${iconSize} transition-all duration-300 ${
            hasLiked
              ? "text-red-500 fill-red-500 scale-110"
              : "text-white group-hover:text-red-500"
          }`}
        />
        <span className="absolute -bottom-5 text-xs sm:text-sm font-medium text-white">
          {likes}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`${buttonSize} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onComment(shortId)}
      >
        <MessageCircle className={`${iconSize} text-white group-hover:text-luxury-primary`} />
        <span className="absolute -bottom-5 text-xs sm:text-sm font-medium text-white">
          {comments}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`${buttonSize} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onSave(shortId)}
      >
        <Bookmark
          className={`${iconSize} transition-all duration-300 ${
            hasSaved
              ? "text-luxury-primary fill-luxury-primary scale-110"
              : "text-white group-hover:text-luxury-primary"
          }`}
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`${buttonSize} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 group`}
        onClick={() => onShare(shortId)}
      >
        <Share2 className={`${iconSize} text-white group-hover:text-luxury-primary`} />
      </Button>
    </div>
  );
};
