import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  postId: string;
  likesCount: number | null;
  hasLiked: boolean;
  onLike: (postId: string) => Promise<void>;
}

export const LikeButton = ({ postId, likesCount, hasLiked, onLike }: LikeButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => onLike(postId)}
    >
      <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-primary text-primary" : ""}`} />
      {likesCount || 0}
    </Button>
  );
};