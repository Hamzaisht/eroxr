import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "./types";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
}

export const PostCard = ({ post, onLike }: PostCardProps) => {
  return (
    <Card key={post.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4">
        <Link to={`/profile/${post.creator_id}`}>
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage 
              src={post.creator.avatar_url || "https://via.placeholder.com/40"} 
              alt={post.creator.username || "Anonymous"} 
            />
            <AvatarFallback>{post.creator.username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link 
            to={`/profile/${post.creator_id}`}
            className="hover:underline"
          >
            <h3 className="font-semibold">
              {post.creator.username || "Anonymous"}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.media_url && post.media_url.length > 0 && (
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
            {post.media_url.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                className="rounded-lg w-full h-48 object-cover"
              />
            ))}
          </div>
        )}
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp
              className={`h-4 w-4 ${
                post.has_liked ? "fill-primary text-primary" : ""
              }`}
            />
            {post.likes_count || 0}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {post.comments_count || 0}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};