import { Post } from "@/components/feed/Post";
import { useSession } from "@supabase/auth-helpers-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";
import type { FeedPost } from "../types";

export const TrendingContent = () => {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data, isLoading, isError } = useInfiniteQuery({
    queryKey: ["trending-posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url)
        `)
        .order("likes_count", { ascending: false })
        .range(0, 19);

      if (error) throw error;

      return posts?.map(post => ({
        ...post,
        has_liked: false,
        visibility: post.visibility || "public",
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0,
        updated_at: post.updated_at || post.created_at
      })) || [];
    },
    initialPageParam: 0,
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
          {page
            .filter((post: FeedPost) => post.likes_count > 50)
            .map((post: FeedPost) => (
              <Post
                key={post.id}
                post={post}
                creator={post.creator}
                currentUser={session?.user || null}
              />
            ))}
        </motion.div>
      ))}
    </motion.div>
  );
};