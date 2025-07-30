
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShortActionsProps {
  hasLiked: boolean;
  hasSaved: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onDelete?: () => void;
  isDeleting: boolean;
}

export const ShortActions = ({
  hasLiked,
  hasSaved,
  likesCount,
  commentsCount,
  sharesCount,
  onLike,
  onComment,
  onShare,
  onSave,
  onDelete,
  isDeleting
}: ShortActionsProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Handle like with loading state
  const handleLike = async () => {
    try {
      setIsLiking(true);
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };
  
  // Handle save with loading state
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle share with loading state
  const handleShare = async () => {
    try {
      setIsSharing(true);
      await onShare();
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Like Button - Mobile Optimized */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm touch-feedback mobile-focus-visible"
          onClick={handleLike}
          disabled={isLiking}
        >
          {isLiking ? (
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
          ) : (
            <Heart 
              className={cn("h-5 w-5 sm:h-6 sm:w-6", hasLiked ? "fill-red-500 text-red-500" : "text-white")} 
            />
          )}
        </Button>
        <span className="text-center text-white text-xs mt-1 font-medium">
          {likesCount > 0 ? likesCount.toLocaleString() : ''}
        </span>
      </div>
      
      {/* Comment Button - Mobile Optimized */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm touch-feedback mobile-focus-visible"
          onClick={onComment}
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
        <span className="text-center text-white text-xs mt-1 font-medium">
          {commentsCount > 0 ? commentsCount.toLocaleString() : ''}
        </span>
      </div>
      
      {/* Share Button - Mobile Optimized */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm touch-feedback mobile-focus-visible"
          onClick={handleShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
          ) : (
            <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          )}
        </Button>
        <span className="text-center text-white text-xs mt-1 font-medium">
          {sharesCount > 0 ? sharesCount.toLocaleString() : ''}
        </span>
      </div>
      
      {/* Save/Bookmark Button - Mobile Optimized */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm touch-feedback mobile-focus-visible"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
          ) : (
            <Bookmark 
              className={cn("h-5 w-5 sm:h-6 sm:w-6", hasSaved ? "fill-primary text-primary" : "text-white")} 
            />
          )}
        </Button>
      </div>
      
      {onDelete && (
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-red-500/30 backdrop-blur-sm touch-feedback mobile-focus-visible"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
