
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleLike = async () => {
    try {
      setIsLiking(true);
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await onShare();
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-luxury-primary/10"
              onClick={handleLike}
              disabled={isLiking}
            >
              {isLiking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={cn("h-5 w-5", hasLiked && "fill-luxury-primary text-luxury-primary")} />
              )}
              <span className="text-luxury-neutral/80">{likesCount || 0}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
          >
            <p>{hasLiked ? "Unlike" : "Like"} this post</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-luxury-primary/10"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Share2 className="h-5 w-5" />
              )}
              <span className="text-luxury-neutral/80">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
          >
            <p>Share this post</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
