
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
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
          creator:profiles!posts_creator_id_fkey(id, username, avatar_url),
          media_assets!media_assets_post_id_fkey(
            id,
            storage_path,
            media_type,
            mime_type,
            original_name,
            alt_text
          )
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
          <EnhancedPostCard
            key={post.id}
            post={{
              id: post.id,
              content: post.content,
              creator_id: post.creator_id,
              created_at: post.created_at,
              updated_at: post.updated_at,
              likes_count: post.likes_count || 0,
              comments_count: post.comments_count || 0,
              visibility: post.visibility,
              view_count: post.view_count,
              share_count: post.share_count,
              engagement_score: post.engagement_score,
              is_ppv: post.is_ppv,
              ppv_amount: post.ppv_amount,
              creator: {
                id: creator.id,
                username: creator.username,
                avatar_url: creator.avatar_url
              },
              media_assets: Array.isArray(post.media_assets) ? post.media_assets : [],
              isLiked: false,
              isSaved: false
            }}
            currentUserId={session?.user?.id}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
};
