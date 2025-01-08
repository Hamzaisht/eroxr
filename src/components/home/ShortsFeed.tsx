import { useSession } from "@supabase/auth-helpers-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

interface Short {
  id: string;
  video_url: string;
  creator: {
    username: string;
    avatar_url: string;
  };
  created_at: string;
  likes_count: number;
  views_count: number;
}

export const ShortsFeed = () => {
  const session = useSession();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data: shorts, error } = await supabase
        .from("posts")
        .select(`
          id,
          video_urls,
          created_at,
          likes_count,
          creator:profiles(username, avatar_url)
        `)
        .eq("visibility", "public")
        .not("video_urls", "is", null)
        .order("created_at", { ascending: false })
        .range(pageParam * 10, (pageParam + 1) * 10 - 1);

      if (error) throw error;
      return shorts;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-220px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary" />
      </div>
    );
  }

  const shorts = data?.pages.flat() || [];

  if (!shorts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] text-muted-foreground">
        <Video className="h-12 w-12 mb-4" />
        <p>No shorts available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {shorts.map((short) => (
        <motion.div
          key={short.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black"
        >
          <video
            src={short.video_urls?.[0]}
            className="w-full h-full object-cover"
            controls
            playsInline
            loop
          >
            <source src={short.video_urls?.[0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium">{short.creator?.username}</p>
          </div>
        </motion.div>
      ))}
      {hasNextPage && (
        <div ref={ref} className="col-span-full h-20 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-primary" />
          )}
        </div>
      )}
    </div>
  );
};