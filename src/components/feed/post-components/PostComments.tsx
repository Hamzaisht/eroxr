
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

interface PostCommentsProps {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export const PostComments = ({ postId, comments, onAddComment }: PostCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="You" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
              <AvatarFallback>{comment.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="font-medium text-sm mb-1">{comment.author.username}</div>
                <div className="text-sm">{comment.content}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{comment.createdAt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
