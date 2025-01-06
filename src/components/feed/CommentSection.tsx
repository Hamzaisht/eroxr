import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Creator {
  username: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: Creator;
}

interface CommentSectionProps {
  postId: string;
  commentsCount: number | null;
}

export const CommentSection = ({ postId, commentsCount }: CommentSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          post_id,
          profiles:user_id(username, avatar_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return (data || []) as Comment[];
    },
    enabled: isExpanded,
  });

  const handleSubmitComment = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on posts.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            content: newComment,
            post_id: postId,
            user_id: session.user.id,
          },
        ]);

      if (error) throw error;

      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageSquare className="h-4 w-4" />
        {commentsCount || 0} Comments
      </Button>

      {isExpanded && (
        <div className="space-y-4">
          {session && (
            <div className="space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={handleSubmitComment}>Post Comment</Button>
            </div>
          )}

          {isLoading ? (
            <div>Loading comments...</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.profiles.avatar_url || ""}
                      alt={comment.profiles.username || ""}
                    />
                    <AvatarFallback>
                      {comment.profiles.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {comment.profiles.username || "Anonymous"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};