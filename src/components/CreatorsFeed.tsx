import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { LoadingSkeleton } from "./feed/LoadingSkeleton";
import { Post } from "./feed/types";

export const CreatorsFeed = () => {
  const { toast } = useToast();
  const session = useSession();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts", session?.user?.id],
    queryFn: async () => {
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

    try {
      const { error: existingLikeError, data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingLikeError) throw existingLikeError;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.user.id);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: session.user.id }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 pr-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};