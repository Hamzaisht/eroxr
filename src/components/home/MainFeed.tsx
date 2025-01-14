import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CreatePostArea } from "./CreatePostArea";
import { LiveStreams } from "./LiveStreams";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";
import { FeedHeader } from "./feed/FeedHeader";
import { FeedContent } from "./feed/FeedContent";
import { TrendingContent } from "./feed/TrendingContent";
import type { MainFeedProps, FeedPost } from "./types";

export const MainFeed = ({
  userId,
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: MainFeedProps) => {
  const [activeTab, setActiveTab] = useState("feed");
  const { ref, inView } = useInView();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const session = useSession();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", userId, activeTab],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(`Fetching ${activeTab} feed data for user:`, userId);
      const from = pageParam * 10;
      const to = from + 9;

      let query = supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url)
        `)
        .range(from, to);

      switch (activeTab) {
        case "trending":
          query = query.order("likes_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
          if (userId) {
            query = query.eq("creator_id", userId);
          }
      }

      const { data: posts, error } = await query;

      if (error) {
        console.error("Feed fetch error:", error);
        throw error;
      }

      return posts?.map(post => ({
        ...post,
        has_liked: false,
        visibility: post.visibility || "public",
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0,
        updated_at: post.updated_at || post.created_at
      })) || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });

  // Load more posts when scrolling to the bottom
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div className={`w-full ${isMobile ? "px-2" : "px-4"} py-6`}>
      <CreatePostArea
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        isPayingCustomer={isPayingCustomer}
      />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="feed" className="mt-6">
            <FeedContent
              data={data}
              isLoading={isLoading}
              isError={isError}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              observerRef={ref}
            />
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <TrendingContent data={data} />
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            <LiveStreams onGoLive={onOpenGoLive} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};