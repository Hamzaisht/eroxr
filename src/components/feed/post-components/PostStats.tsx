
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostStatsProps {
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export const PostStats = ({
  likesCount,
  commentsCount,
  sharesCount = 0,
  isLiked,
  isSaved,
  onLike,
  onComment,
  onShare,
  onSave
}: PostStatsProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="flex items-center gap-2 text-gray-600"
        >
          <Share2 className="h-5 w-5" />
          <span>{sharesCount}</span>
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        className={`${isSaved ? 'text-blue-500' : 'text-gray-600'}`}
      >
        <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
};
