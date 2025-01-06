import { Button } from "@/components/ui/button";
import { ThumbsUp, Share, Bookmark, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { CommentSection } from "./CommentSection";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('post_saves')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!error && data) {
        setIsSaved(true);
      }
    };

    checkSavedStatus();
  }, [postId, session?.user?.id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Share Post",
          text: "Check out this post",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Post link has been copied to your clipboard",
        });
      }
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

  const handleSave = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save posts.",
        duration: 3000,
      });
      return;
    }

    try {
      if (isSaved) {
        const { error: deleteError } = await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', session.user.id);

        if (deleteError) throw deleteError;
        setIsSaved(false);
        
        toast({
          title: "Post unsaved",
          description: "Removed from your saved posts",
        });
      } else {
        const { error: insertError } = await supabase
          .from('post_saves')
          .insert([{ post_id: postId, user_id: session.user.id }]);

        if (insertError) throw insertError;
        setIsSaved(true);
        
        toast({
          title: "Post saved",
          description: "Added to your saved posts",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    }
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
        {navigator.share ? <Share className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        {navigator.share ? "Share" : "Copy Link"}
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