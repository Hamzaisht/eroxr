import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share, Bookmark, MoreVertical, Trash, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "./types";
import { CommentSection } from "./CommentSection";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Post by ${post.creator.username}`,
        text: post.content,
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

  const handlePurchase = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase content",
        duration: 3000,
      });
      return;
    }

    // Here you would typically integrate with your payment processor
    // For now, we'll just simulate a successful purchase
    try {
      const { error } = await supabase
        .from('post_purchases')
        .insert([
          {
            post_id: post.id,
            user_id: session.user.id,
            amount: post.ppv_amount
          }
        ]);

      if (error) throw error;

      toast({
        title: "Purchase successful",
        description: "You now have access to this content",
      });

      // Refresh the posts to update the UI
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const isOwner = currentUserId === post.creator_id;

  return (
    <Card key={post.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
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
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(post.id, post.creator_id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {post.is_ppv && !post.has_purchased && !isOwner ? (
          <div className="space-y-4 p-6 text-center">
            <Lock className="w-12 h-12 mx-auto text-luxury-primary" />
            <div>
              <h3 className="text-lg font-semibold">Premium Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock this content for ${post.ppv_amount}
              </p>
              <Button
                onClick={handlePurchase}
                className="bg-luxury-primary hover:bg-luxury-primary/90"
              >
                Purchase Access
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{post.content}</p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

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
            
            {post.visibility === 'subscribers_only' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Subscribers Only
              </Badge>
            )}

            {post.is_ppv && (
              <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                Premium Content
              </Badge>
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
              <CommentSection postId={post.id} commentsCount={post.comments_count} />
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
