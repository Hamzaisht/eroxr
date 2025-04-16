
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, Send } from "lucide-react";

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  erosId: string;
}

export const CommentDialog = ({
  open,
  onOpenChange,
  erosId
}: CommentDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const session = useSession();

  useEffect(() => {
    if (open && erosId) {
      loadComments();
    }
  }, [open, erosId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call to load comments
      // Simulating API call with timeout and mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockComments: Comment[] = [
        {
          id: "1",
          text: "This is amazing content! 🔥",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          user: {
            id: "user1",
            name: "Alex Johnson",
            avatar: "https://i.pravatar.cc/150?u=alex"
          }
        },
        {
          id: "2",
          text: "I love how creative this is! Keep it up!",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          user: {
            id: "user2",
            name: "Sam Smith",
            avatar: "https://i.pravatar.cc/150?u=sam"
          }
        }
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !session) return;
    
    try {
      // In a real application, this would be an API call to submit a comment
      // Simulating API call with timeout
      const tempId = Math.random().toString(36).substring(7);
      
      const newComment: Comment = {
        id: tempId,
        text: comment,
        created_at: new Date().toISOString(),
        user: {
          id: session.user.id,
          name: session.user.email?.split('@')[0] || "Anonymous",
          avatar: undefined
        }
      };
      
      // Add comment optimistically
      setComments(prev => [newComment, ...prev]);
      setComment("");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would update the comment with the actual data from the server
      
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4 p-1">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">No comments yet. Be the first!</p>
            </div>
          )}
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            disabled={!session}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!comment.trim() || !session}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {!session && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Please sign in to comment
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
