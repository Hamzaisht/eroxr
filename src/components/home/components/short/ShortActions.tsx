
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShortActionsProps {
  hasLiked: boolean;
  hasSaved: boolean;
  likesCount: number;
  commentsCount: number;
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
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50"
        onClick={handleLike}
        disabled={isLiking}
      >
        {isLiking ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Heart 
            className={cn("h-6 w-6", hasLiked ? "fill-red-500 text-red-500" : "text-white")} 
          />
        )}
      </Button>
      <span className="text-center text-white text-sm">{likesCount}</span>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50"
        onClick={onComment}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
      <span className="text-center text-white text-sm">{commentsCount}</span>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Share2 className="h-6 w-6 text-white" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Bookmark 
            className={cn("h-6 w-6", hasSaved ? "fill-luxury-primary text-luxury-primary" : "text-white")} 
          />
        )}
      </Button>
      
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/30 hover:bg-red-500/30"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Trash2 className="h-6 w-6 text-white" />
          )}
        </Button>
      )}
    </div>
  );
};
