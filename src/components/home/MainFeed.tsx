import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";
import { StoryReel } from "@/components/StoryReel";
import { useToast } from "@/hooks/use-toast";
import { Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-mobile";

const MainFeed = ({
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
  onGoLive,
}: MainFeedProps) => {
  const [activeTab, setActiveTab] = useState("feed");
  const session = useSession();
  const { ref, inView } = useInView();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: feed, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("Fetching feed page:", pageParam);
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
      
      return data?.map(post => ({
        ...post,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        updated_at: post.updated_at || post.created_at,
        visibility: post.visibility || 'public',
        tags: post.tags || [],
        ppv_amount: post.ppv_amount || null,
        is_ppv: post.is_ppv || false,
        video_urls: post.video_urls || null,
        has_liked: false,
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0,
        creator: {
          id: post.profiles.id,
          username: post.profiles.username,
          avatar_url: post.profiles.avatar_url
        }
      }));
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
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${isMobile ? 'px-2' : 'px-4 md:px-6'}`}
    >
      <CreatePostArea
        isPayingCustomer={isPayingCustomer}
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        onOpenGoLive={onOpenGoLive}
        onGoLive={onGoLive}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-14 bg-transparent border-b border-luxury-primary/5">
          <TabsTrigger 
            value="feed"
            className="data-[state=active]:bg-luxury-primary/10 data-[state=active]:text-luxury-primary"
          >
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="live"
            className="data-[state=active]:bg-luxury-primary/10 data-[state=active]:text-luxury-primary"
          >
            Live
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="mt-6">
          <div className="space-y-6">
            {status === "pending" ? (
              <div className="flex justify-center p-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-8 h-8 text-luxury-primary" />
                </motion.div>
              </div>
            ) : status === "error" ? (
              <div className="text-center p-8 rounded-xl bg-luxury-dark/50 backdrop-blur-sm">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-red-500">Error loading feed</p>
                <p className="text-sm text-luxury-neutral/60 mt-2">Please try again later</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {feed?.pages.map((page, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="space-y-6"
                  >
                    {page.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        creator={post.creator}
                        currentUser={session?.user}
                      />
                    ))}
                  </motion.div>
                ))}
                
                <div ref={ref} className="h-20 flex items-center justify-center">
                  {isFetchingNextPage && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6 text-luxury-primary/60" />
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="live">
          <LiveStreams />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MainFeed;