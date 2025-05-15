
import { Post } from "@/components/feed/Post";
import { useSession } from "@supabase/auth-helpers-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";
import type { FeedPost } from "../types";
import type { Post as PostType } from "@/integrations/supabase/types/post";

export const TrendingContent = () => {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["trending-posts"],
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number || 0) * 10;
      const to = from + 9;

      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url)
        `)
        .order("likes_count", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return posts as PostType[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === 10 ? allPages.length : undefined;
    }
  });

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
        <p>Error loading trending content</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`grid gap-4 ${
          isMobile 
            ? "grid-cols-1" 
            : "md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {data?.pages.map((page, i) => (
          <motion.div 
            key={i} 
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {page && Array.isArray(page) && 
              page
                .filter(post => post && typeof post === 'object' && post.likes_count && post.likes_count > 50)
                .map((post: PostType) => (
                  <Post
                    key={post.id}
                    post={post}
                    creator={post.creator}
                    currentUser={session?.user || null}
                  />
                ))
            }
          </motion.div>
        ))}

        {hasNextPage && (
          <div className="col-span-full flex justify-center p-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 bg-luxury-dark/30 hover:bg-luxury-dark/50 rounded-lg transition-colors"
            >
              {isFetchingNextPage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
