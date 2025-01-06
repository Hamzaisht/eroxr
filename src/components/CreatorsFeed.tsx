import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { LoadingSkeleton } from "./feed/LoadingSkeleton";
import { EmptyFeed } from "./feed/EmptyFeed";
import { useFeedQuery } from "./feed/useFeedQuery";
import { usePostActions } from "./feed/usePostActions";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const CreatorsFeed = () => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFeedQuery(session?.user?.id);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flat() || [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike}
                  onDelete={handleDelete}
                  currentUserId={session?.user?.id}
                />
              ))}
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