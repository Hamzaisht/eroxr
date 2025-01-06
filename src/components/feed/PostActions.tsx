import { Button } from "@/components/ui/button";
import { ThumbsUp, Share, Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { CommentSection } from "./CommentSection";

interface PostActionsProps {
  postId: string;
  likesCount: number | null;
  commentsCount: number | null;
  hasLiked: boolean;
  onLike: (postId: string) => Promise<void>;
}

export const PostActions = ({ postId, likesCount, commentsCount, hasLiked, onLike }: PostActionsProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Share Post",
        text: "Check out this post",
        url: window.location.href,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Error sharing post",
          description: "Could not share the post. Try copying the link instead.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save posts.",
        duration: 3000,
      });
      return;
    }
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Post unsaved" : "Post saved",
      description: isSaved ? "Removed from your saved posts" : "Added to your saved posts",
    });
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => onLike(postId)}
      >
        <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-primary text-primary" : ""}`} />
        {likesCount || 0}
      </Button>
      <CommentSection postId={postId} commentsCount={commentsCount} />
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleShare}
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleSave}
      >
        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
        Save
      </Button>
    </div>
  );
};