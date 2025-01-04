import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Skeleton } from "./ui/skeleton";

interface Post {
  id: string;
  content: string;
  media_url: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  creator: {
    username: string;
    avatar_url: string;
  };
}

export const CreatorsFeed = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          creator:creator_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch posts",
          variant: "destructive",
        });
        throw error;
      }

      return data as Post[];
    },
  });

  const handleLike = async (postId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("post_likes")
      .insert([{ post_id: postId, user_id: session.user.id }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {posts?.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.creator.avatar_url || "https://via.placeholder.com/40"} alt={post.creator.username || "Anonymous"} />
              <AvatarFallback>{post.creator.username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {post.creator.username || "Anonymous"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base">{post.content}</p>
            {post.media_url && post.media_url.length > 0 && (
              <div className="grid gap-2 grid-cols-2">
                {post.media_url.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="rounded-md w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleLike(post.id)}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes_count || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments_count || 0}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};