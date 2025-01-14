import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  hasLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const PostActions = ({
  hasLiked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onShare,
}: PostActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 hover:bg-luxury-primary/10"
        onClick={onLike}
      >
        <Heart className={cn("h-5 w-5", hasLiked && "fill-luxury-primary text-luxury-primary")} />
        <span className="text-luxury-neutral/80">{likesCount || 0}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 hover:bg-luxury-primary/10"
        onClick={onComment}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-luxury-neutral/80">{commentsCount || 0}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 hover:bg-luxury-primary/10"
        onClick={onShare}
      >
        <Share2 className="h-5 w-5" />
        <span className="text-luxury-neutral/80">Share</span>
      </Button>
    </div>
  );
};