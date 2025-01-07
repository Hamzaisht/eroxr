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
    <div className="w-full max-w-[1200px] mx-auto">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-8 px-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-8">
              {posts.map((post) => {
                // Create a properly typed post object with all required fields
                const processedPost = {
                  ...post,
                  visibility: post.visibility || 'public',
                  is_ppv: post.is_ppv || false,
                  has_liked: post.has_liked || false,
                  updated_at: post.updated_at || post.created_at, // Add fallback for updated_at
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