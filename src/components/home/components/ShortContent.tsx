import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Trash, Eye } from "lucide-react";
import { Short } from "../types/short";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { formatNumber } from "@/lib/utils";

interface ShortContentProps {
  short: {
    id: string;
    creator: {
      username: string;
      avatar_url: string | null;
      id?: string;
    };
    description: string;
    likes: number;
    comments: number;
    has_liked?: boolean;
    has_saved?: boolean;
    created_at?: string;
    view_count?: number;
  };
  onShare: (shortId: string) => void;
  onComment: () => void;
  handleLike: (shortId: string) => Promise<void>;
  handleSave: (shortId: string) => Promise<void>;
  onDelete?: () => void;
  isDeleting?: boolean;
  isCurrentVideo?: boolean;
  className?: string;
}

export const ShortContent = ({
  short,
  onShare,
  onComment,
  handleLike,
  handleSave,
  onDelete,
  isDeleting = false,
  isCurrentVideo = false,
  className = "",
}: ShortContentProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLikeClick = async () => {
    try {
      setIsLiking(true);
      await handleLike(short.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);
      await handleSave(short.id);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isCurrentVideo ? 1 : 0.7, 
        y: isCurrentVideo ? 0 : 10 
      }}
      transition={{ duration: 0.3 }}
      className={cn("text-white", className)}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-luxury-primary/30">
          {short.creator.avatar_url ? (
            <img
              src={short.creator.avatar_url}
              alt={short.creator.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold">
              {short.creator.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">@{short.creator.username}</h3>
          <p className="text-sm text-luxury-neutral/90 line-clamp-2 mt-1">{short.description}</p>
          {short.created_at && (
            <p className="text-xs text-luxury-neutral/70 mt-1">
              {formatDistanceToNow(new Date(short.created_at), { addSuffix: true })}
            </p>
          )}
        </div>
        
        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-luxury-primary/20 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-luxury-darker border-luxury-primary/20">
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                onClick={onDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash className="w-4 h-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <button
            className="flex flex-col items-center gap-1"
            onClick={handleLikeClick}
            disabled={isLiking}
          >
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary/20 transition-colors">
              {isLiking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${short.has_liked ? 'fill-luxury-primary text-luxury-primary' : ''}`} />
              )}
            </div>
            <span className="text-xs">{formatNumber(short.likes)}</span>
          </button>
          
          <button
            className="flex flex-col items-center gap-1"
            onClick={onComment}
          >
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary/20 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs">{formatNumber(short.comments)}</span>
          </button>
          
          <button
            className="flex flex-col items-center gap-1"
            onClick={() => onShare(short.id)}
          >
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary/20 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs">Share</span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-xs">{formatNumber(short.view_count || 0)}</span>
          </div>
        </div>
        
        <button
          className="flex items-center justify-center"
          onClick={handleSaveClick}
          disabled={isSaving}
        >
          <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary/20 transition-colors">
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Bookmark className={`w-5 h-5 ${short.has_saved ? 'fill-luxury-primary text-luxury-primary' : ''}`} />
            )}
          </div>
        </button>
      </div>
    </motion.div>
  );
};
