import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreatePostArea } from "./CreatePostArea";
import { Post } from "@/components/feed/Post";
import { LiveStreams } from "./LiveStreams";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";
import type { MainFeedProps, FeedPost } from "./types";

export const MainFeed = ({ 
  userId,
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive
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
    isFetchingNextPage
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
    enabled: !!userId // Only fetch when we have a userId
  });

  // Load more posts when scrolling to the bottom
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div className={`w-full ${isMobile ? 'px-2' : 'px-4'} py-6`}>
      <CreatePostArea
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        isPayingCustomer={isPayingCustomer}
      />

      <Tabs defaultValue="feed" className="w-full mt-6" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 bg-transparent border-b border-luxury-neutral/10">
          <TabsTrigger
            value="feed"
            className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary"
          >
            Feed
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary"
          >
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="data-[state=active]:bg-transparent data-[state=active]:text-luxury-primary"
          >
            Live
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p>Error loading feed</p>
            </div>
          ) : (
            <>
              {data?.pages.map((page, i) => (
                <div key={i} className="space-y-4">
                  {page.map((post: FeedPost) => (
                    <Post
                      key={post.id}
                      post={post}
                      creator={post.creator}
                      currentUser={session?.user || null}
                    />
                  ))}
                </div>
              ))}
              <div ref={ref} className="h-10">
                {isFetchingNextPage && (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.pages.map((page, i) => (
              <div key={i} className="space-y-4">
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
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live">
          <LiveStreams onGoLive={onOpenGoLive} />
        </TabsContent>
      </Tabs>
    </div>
  );
};