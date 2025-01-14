import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TabsContent } from "@/components/ui/tabs";
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
    queryKey: ["feed", userId],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("Fetching feed data for user:", userId);
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .range(pageParam * 10, (pageParam + 1) * 10 - 1);

      if (error) {
        console.error("Feed fetch error:", error);
        throw error;
      }
      return posts as FeedPost[];
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
        <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <TabsContent value="feed">
          <FeedContent
            data={data}
            isLoading={isLoading}
            isError={isError}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            observerRef={ref}
          />
        </TabsContent>

        <TabsContent value="trending">
          <TrendingContent data={data} />
        </TabsContent>

        <TabsContent value="live">
          <LiveStreams onGoLive={onOpenGoLive} />
        </TabsContent>
      </div>
    </div>
  );
};