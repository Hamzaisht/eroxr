
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Post } from "@/components/feed/Post";
import { useSession } from "@supabase/auth-helpers-react";
import { usePostActions } from "@/hooks/usePostActions";

export const FeedContent = () => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:profiles(id, username)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No posts available yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post: any) => {
        const creator = post.creator || { id: post.creator_id, username: "Unknown" };
        
        return (
          <Post
            key={post.id}
            post={{
              id: post.id,
              content: post.content,
              creator: {
                id: creator.id,
                username: creator.username,
                isVerified: false
              },
              createdAt: post.created_at,
              likesCount: post.likes_count || 0,
              commentsCount: post.comments_count || 0,
              isLiked: false,
              isSaved: false
            }}
            currentUser={session?.user ? {
              id: session.user.id,
              username: "You"
            } : undefined}
          />
        );
      })}
    </div>
  );
};
