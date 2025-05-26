
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { PostCard } from "@/components/feed/PostCard";
import { usePostActions } from "@/hooks/usePostActions";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const FeedContainer = () => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: posts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['feed', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:profiles(id, username),
          post_likes!left(id, user_id),
          post_saves!left(id, user_id)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return data?.map((post: any) => ({
        ...post,
        has_liked: post.post_likes?.some((like: any) => like.user_id === session?.user?.id) || false,
        has_saved: post.post_saves?.some((save: any) => save.user_id === session?.user?.id) || false,
        creator: post.creator || { id: post.creator_id, username: 'Unknown' }
      })) || [];
    },
    enabled: true
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
        <p className="text-luxury-neutral">Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert className="bg-luxury-darker border-red-500/20">
          <AlertDescription className="text-luxury-neutral">
            Failed to load posts. Please try again.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="w-full"
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Try Again
        </Button>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📝</div>
        <h3 className="text-xl font-semibold text-luxury-neutral">No posts yet</h3>
        <p className="text-luxury-neutral/70 max-w-md mx-auto">
          Be the first to share something with the community! Create a post to get started.
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-luxury-neutral">Latest Posts</h2>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              creator_id: post.creator_id,
              content: post.content,
              likes_count: post.likes_count || 0,
              comments_count: post.comments_count || 0,
              created_at: post.created_at,
              updated_at: post.updated_at || post.created_at,
              visibility: post.visibility as 'public' | 'subscribers_only',
              tags: post.tags || null,
              is_ppv: post.is_ppv || false,
              ppv_amount: post.ppv_amount || null,
              video_urls: post.video_urls || null,
              has_liked: post.has_liked,
              has_saved: post.has_saved,
              has_purchased: false,
              screenshots_count: post.screenshots_count || 0,
              downloads_count: post.downloads_count || 0,
              creator: post.creator
            }}
            onLike={handleLike}
            onDelete={handleDelete}
            currentUserId={session?.user?.id}
          />
        ))}
      </div>
    </div>
  );
};
