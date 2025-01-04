import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";

type Post = {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
  creator: {
    username: string | null;
    avatar_url: string | null;
  };
  likes_count: number | null;
  comments_count: number | null;
  media_url: string[] | null;
  has_liked: boolean;
};

export const CreatorsFeed = () => {
  const { toast } = useToast();
  const session = useSession();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts", session?.user?.id],
    queryFn: async () => {
      const userId = session?.user?.id;

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          created_at,
          creator_id,
          creator:profiles(username, avatar_url),
          likes_count,
          comments_count,
          media_url,
          has_liked:post_likes!inner(id)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching posts",
          description: "Could not load posts. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data?.map(post => ({
        ...post,
        has_liked: post.has_liked?.length > 0
      })) || [];
    },
  });

  const handleLike = async (postId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        duration: 3000,
      });
      return;
    }

    // Logic for liking a post
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Latest Updates</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.map((post) => (
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
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{post.content}</p>
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
                    onClick={() => handleLike(post.id)}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};