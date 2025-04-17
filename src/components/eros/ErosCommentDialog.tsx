
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { ErosComment } from "@/types/eros";
import { formatDistanceToNow } from "date-fns";

interface ErosCommentDialogProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments?: ErosComment[];
  isLoading?: boolean;
  onAddComment?: (content: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
}

export function ErosCommentDialog({
  videoId,
  open,
  onOpenChange,
  comments = [],
  isLoading = false,
  onAddComment,
  onLikeComment,
}: ErosCommentDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment"
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      if (onAddComment) {
        await onAddComment(newComment);
      }
      setNewComment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLikeComment = async (commentId: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments"
      });
      return;
    }
    
    if (onLikeComment) {
      await onLikeComment(commentId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 max-h-[70vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatarUrl} />
                    <AvatarFallback>
                      {comment.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="self-start p-1"
                    aria-label={comment.hasLiked ? "Unlike" : "Like"}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        comment.hasLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Comment input */}
        <form 
          onSubmit={handleSubmitComment}
          className="border-t p-3 flex items-center gap-2"
        >
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
