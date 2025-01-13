import { useState } from "react";
import { CreatePostArea } from "./CreatePostArea";
import { LiveStreams } from "./LiveStreams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Post } from "@/components/feed/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Post as PostType } from "@/components/feed/types";

interface PostWithProfiles extends PostType {
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface MainFeedProps {
  isPayingCustomer: boolean | null;
  onOpenCreatePost?: () => void;
  onFileSelect?: (files: FileList | null) => void;
  onOpenGoLive?: () => void;
  onGoLive?: () => void;
}

export const MainFeed = ({
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
  onGoLive,
}: MainFeedProps) => {
  const [activeTab, setActiveTab] = useState("feed");
  const session = useSession();
  const { ref, inView } = useInView();

  const { data: feed, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:creator_id (
            id,
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .range(pageParam * 10, (pageParam + 1) * 10 - 1);

      if (error) throw error;
      return data as PostWithProfiles[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length === 10) {
        return pages.length;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="space-y-6">
      <CreatePostArea
        isPayingCustomer={isPayingCustomer}
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        onOpenGoLive={onOpenGoLive}
        onGoLive={onGoLive}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-luxury-dark/20">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <div className="space-y-6">
            {status === "pending" ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : status === "error" ? (
              <div className="text-center p-4 text-red-500">Error loading feed</div>
            ) : (
              <>
                {feed?.pages.map((page, i) => (
                  <div key={i} className="space-y-6">
                    {page.map((post: PostWithProfiles) => (
                      <Post
                        key={post.id}
                        post={post}
                        creator={post.profiles}
                        currentUser={session?.user}
                      />
                    ))}
                  </div>
                ))}
                <div ref={ref} className="h-10">
                  {isFetchingNextPage && (
                    <div className="flex justify-center p-4">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="live">
          <LiveStreams />
        </TabsContent>
      </Tabs>
    </div>
  );
};