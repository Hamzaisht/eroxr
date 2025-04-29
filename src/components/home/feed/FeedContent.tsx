
import { useEffect } from "react";
import { Post } from "@/components/feed/Post";
import { Loader2, AlertTriangle } from "lucide-react";
import type { FeedPost } from "../types";
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";
import { EmptyFeed } from "@/components/feed/EmptyFeed";
import { usePostActions } from "@/components/feed/usePostActions";

interface FeedContentProps {
  userId?: string;
}

export const FeedContent = ({ userId }: FeedContentProps) => {
  const session = useSession();
  const { ref, inView } = useInView();
  const { handleLike, handleDelete } = usePostActions();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "feed", userId],
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number || 0) * 10;
      const to = from + 9;

      let query = supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url),
          post_likes(user_id)
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      const { data: posts, error } = await query;

      if (error) {
        console.error("Feed fetch error:", error);
        throw error;
      }

      return posts?.map(post => ({
        ...post,
        has_liked: post.post_likes?.some(like => like.user_id === session?.user?.id) || false,
        creator: {
          id: post.creator?.id,
          username: post.creator?.username || "Anonymous",
          avatar_url: post.creator?.avatar_url || null
        }
      })) || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === 10 ? allPages.length : undefined;
    }
  });

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p>Error loading feed</p>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap(page => page) || [];

  if (!allPosts.length) {
    return <EmptyFeed />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {allPosts.map((post: FeedPost) => (
          <Post
            key={post.id}
            post={post}
            creator={post.creator}
            currentUser={session?.user || null}
            onLike={() => handleLike(post.id)}
            onDelete={() => handleDelete(post.id, post.creator_id)}
          />
        ))}

        <div ref={ref} className="h-10">
          {isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
