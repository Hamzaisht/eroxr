
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { EmptyFeed } from "./feed/EmptyFeed";
import { useFeedQuery } from "./feed/useFeedQuery";
import { usePostActions } from "./feed/usePostActions";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { useEffect, useCallback, memo } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import type { Post } from "./feed/types";
import { Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

interface CreatorsFeedProps {
  feedType?: 'feed' | 'popular' | 'recent';
}

const MemoizedPostCard = memo(PostCard);

export const CreatorsFeed = memo(({ feedType = 'feed' }: CreatorsFeedProps) => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  const { id } = useParams();
  const currentUserId = session?.user?.id;
  
  useRealtimeUpdates('posts');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isError,
    error
  } = useFeedQuery(id || session?.user?.id, feedType);

  useEffect(() => {
    refetch();
  }, [refetch, feedType]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const posts = data?.pages.flat() || [];

  const handleLikePost = useCallback((postId: string) => {
    return handleLike(postId);
  }, [handleLike]);

  const handleDeletePost = useCallback((postId: string, creatorId: string) => {
    return handleDelete(postId, creatorId);
  }, [handleDelete]);

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          <p className="text-luxury-neutral text-sm">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert className="bg-luxury-darker border-red-500/20 mb-4">
            <AlertDescription className="flex flex-col items-center gap-4">
              <p className="text-luxury-neutral">Error loading posts: {error instanceof Error ? error.message : "Something went wrong"}</p>
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => refetch()}
            className="mx-auto flex items-center gap-2 w-full"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return <EmptyFeed />;
  }

  return (
    <div className="w-full mx-auto">
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {posts.map((post: any) => {
              const typedPost: Post = {
                ...post,
                id: post.id,
                creator_id: post.creator_id,
                content: post.content,
                media_url: post.media_url || [],
                likes_count: post.likes_count || 0,
                comments_count: post.comments_count || 0,
                created_at: post.created_at,
                updated_at: post.updated_at || post.created_at,
                visibility: (post.visibility || 'public') as 'public' | 'subscribers_only',
                tags: post.tags || null,
                is_ppv: post.is_ppv || false,
                ppv_amount: post.ppv_amount || null,
                video_urls: post.video_urls || null,
                has_liked: post.has_liked || false,
                has_saved: post.has_saved || false,
                has_purchased: post.has_purchased || false,
                screenshots_count: post.screenshots_count || 0,
                downloads_count: post.downloads_count || 0,
                creator: {
                  id: post.creator?.id || '',
                  username: post.creator?.username || 'Anonymous',
                  avatar_url: post.creator?.avatar_url || null
                }
              };

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <MemoizedPostCard
                    post={typedPost}
                    onLike={handleLikePost}
                    onDelete={handleDeletePost}
                    currentUserId={currentUserId}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {hasNextPage && (
            <div ref={ref} className="h-16 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-luxury-primary" />
                  <p className="text-luxury-neutral text-sm">Loading more posts...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

CreatorsFeed.displayName = "CreatorsFeed";
