import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { LoadingSkeleton } from "./feed/LoadingSkeleton";
import { EmptyFeed } from "./feed/EmptyFeed";
import { useFeedQuery } from "./feed/useFeedQuery";
import { usePostActions } from "./feed/usePostActions";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";

interface CreatorsFeedProps {
  feedType?: 'feed' | 'popular' | 'recent';
}

export const CreatorsFeed = ({ feedType = 'feed' }: CreatorsFeedProps) => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { ref, inView } = useInView();
  const { id } = useParams();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFeedQuery(id || session?.user?.id, feedType);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flat() || [];

  return (
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-8">
              {posts.map((post) => {
                const processedPost = {
                  ...post,
                  visibility: post.visibility || 'public',
                  is_ppv: post.is_ppv || false,
                  has_liked: post.has_liked || false,
                  updated_at: post.created_at,
                  screenshots_count: post.screenshots_count || 0,
                  downloads_count: post.downloads_count || 0,
                  creator: {
                    username: post.creator?.username || null,
                    avatar_url: post.creator?.avatar_url || null
                  }
                };

                return (
                  <PostCard 
                    key={post.id} 
                    post={processedPost}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    currentUserId={session?.user?.id}
                  />
                );
              })}
              {posts.length === 0 && <EmptyFeed />}
              {hasNextPage && (
                <div ref={ref} className="h-8 flex items-center justify-center">
                  {isFetchingNextPage && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-primary" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};