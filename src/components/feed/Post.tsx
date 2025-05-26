
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostContent } from "./PostContent";
import { PostStats } from "./post-components/PostStats";
import { PostComments } from "./post-components/PostComments";
import { usePostActions } from "@/hooks/usePostActions";
import { formatDistanceToNow } from "date-fns";

interface PostProps {
  post: {
    id: string;
    content: string;
    creator: {
      id: string;
      username: string;
      isVerified?: boolean;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    isSaved?: boolean;
  };
  currentUser?: {
    id: string;
    username: string;
  };
}

export const Post = ({ post, currentUser }: PostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const { handleLike, handleDelete } = usePostActions();

  const onLike = () => handleLike(post.id);
  const onComment = () => setShowComments(!showComments);
  const onShare = () => {
    // Share functionality
  };
  const onSave = () => {
    // Save functionality
  };

  const onAddComment = (content: string) => {
    // Add comment functionality
    const newComment = {
      id: Date.now().toString(),
      content,
      author: {
        username: currentUser?.username || "Anonymous"
      },
      createdAt: "just now"
    };
    setComments([...comments, newComment]);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={post.creator.username} />
            <AvatarFallback>{post.creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.creator.username}</span>
              {post.creator.isVerified && (
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-4">
          <PostContent content={post.content} creatorId={post.creator.id} />
        </div>

        {/* Post Stats */}
        <PostStats
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          isLiked={post.isLiked || false}
          isSaved={post.isSaved || false}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onSave={onSave}
        />

        {/* Comments Section */}
        {showComments && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <PostComments
              postId={post.id}
              comments={comments}
              onAddComment={onAddComment}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
