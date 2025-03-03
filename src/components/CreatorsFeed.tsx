
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { LoadingSkeleton } from "./feed/LoadingSkeleton";
import { EmptyFeed } from "./feed/EmptyFeed";
import { useFeedQuery } from "./feed/useFeedQuery";
import { usePostActions } from "./feed/usePostActions";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import type { Post } from "@/integrations/supabase/types/post";
import { Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

interface CreatorsFeedProps {
  feedType?: 'feed' | 'popular' | 'recent';
}

export const CreatorsFeed = ({ feedType = 'feed' }: CreatorsFeedProps) => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { ref, inView } = useInView();
  const { id } = useParams();
  const currentUserId = session?.user?.id;

  console.log('CreatorsFeed - currentUserId:', currentUserId);
  
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
              <p className="text-luxury-neutral">Error loading posts: {error?.message || "Something went wrong"}</p>
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
          <div className="space-y-4">
            {posts.map((post) => {
              const typedPost: Post = {
                ...post,
                visibility: (post.visibility || 'public') as 'public' | 'subscribers_only',
                is_ppv: post.is_ppv || false,
                has_liked: post.has_liked || false,
                updated_at: post.updated_at || post.created_at,
                screenshots_count: post.screenshots_count || 0,
                downloads_count: post.downloads_count || 0,
                creator: {
                  id: post.creator?.id,
                  username: post.creator?.username || null,
                  avatar_url: post.creator?.avatar_url || null
                }
              };

              console.log('CreatorsFeed - post.creator_id:', post.creator_id);
              console.log('CreatorsFeed - currentUserId:', currentUserId);
              console.log('CreatorsFeed - isOwner:', post.creator_id === currentUserId);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard
                    post={typedPost}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    currentUserId={currentUserId}
                  />
                </motion.div>
              );
            })}
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
        </div>
      </ScrollArea>
    </div>
  );
};
