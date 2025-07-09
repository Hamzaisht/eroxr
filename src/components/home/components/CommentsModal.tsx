import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Heart } from "lucide-react";
import { useErosComments } from "@/hooks/useErosComments";
import { formatDistanceToNow } from "date-fns";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
}

export const CommentsModal = ({ isOpen, onClose, videoId, videoTitle }: CommentsModalProps) => {
  const [newComment, setNewComment] = useState("");
  const { comments, loading, addComment, likeComment } = useErosComments(videoId);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col bg-gradient-to-b from-background via-background/95 to-background border border-primary/20">
        <DialogHeader className="border-b border-primary/10 pb-4">
          <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Comments
          </DialogTitle>
          <p className="text-sm text-muted-foreground truncate">{videoTitle}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src={comment.user.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {comment.user.username[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          @{comment.user.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-foreground/90 break-words">
                        {comment.content}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs hover:text-primary"
                          onClick={() => likeComment(comment.id)}
                        >
                          <Heart 
                            className={`h-3 w-3 mr-1 ${comment.hasLiked ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                          {comment.likes > 0 ? comment.likes : ''}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmitComment} className="border-t border-primary/10 pt-4">
          <div className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
              maxLength={500}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};