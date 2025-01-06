import { MainLayout } from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { StoryReel } from "@/components/StoryReel";
import { SearchBar } from "@/components/home/SearchBar";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { SuggestedCreators } from "@/components/home/SuggestedCreators";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { FeedHeader } from "@/components/home/FeedHeader";

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(0);
  const session = useSession();
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkPayingCustomerStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paying_customer')
        .eq('id', session.user.id)
        .single();
      
      if (!error && data) {
        setIsPayingCustomer(data.is_paying_customer);
      }
    };

    checkPayingCustomerStatus();
  }, [session?.user?.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!session?.user?.id) return;

    // Listen for new posts from subscribed creators
    const postsChannel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          toast({
            title: "New Content",
            description: "One of your creators just posted something new!",
          });
          setNewNotifications(prev => prev + 1);
        }
      )
      .subscribe();

    // Listen for new stories
    const storiesChannel = supabase
      .channel('public:stories')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stories',
        },
        (payload) => {
          toast({
            title: "New Story",
            description: "Check out new stories from creators you follow!",
          });
          setNewNotifications(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(storiesChannel);
    };
  }, [session?.user?.id, toast]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-luxury-dark to-luxury-dark/95">
        <div className="container max-w-[2000px] mx-auto px-4 py-2">
          <div className="grid grid-cols-[280px,1fr,320px] gap-4">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Main Feed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 min-h-[calc(100vh-4rem)] max-w-[1000px] mx-auto w-full"
            >
              <FeedHeader />

              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <StoryReel />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full bg-luxury-dark/50 backdrop-blur-sm rounded-xl border border-luxury-neutral/10 p-4 shadow-lg"
                >
                  <CreatePostArea
                    onOpenCreatePost={() => setIsCreatePostOpen(true)}
                    onFileSelect={setSelectedFiles}
                    onOpenGoLive={() => setIsGoLiveOpen(true)}
                    isPayingCustomer={isPayingCustomer}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <CreatorsFeed />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Right Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sticky top-4 h-[calc(100vh-2rem)] hidden lg:block"
            >
              <div className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-lg backdrop-blur-lg">
                <SearchBar />
                <SuggestedCreators />
              </div>
            </motion.div>
          </div>
        </div>

        <CreatePostDialog 
          open={isCreatePostOpen} 
          onOpenChange={setIsCreatePostOpen}
          selectedFiles={selectedFiles}
          onFileSelect={setSelectedFiles}
        />

        <GoLiveDialog 
          open={isGoLiveOpen}
          onOpenChange={setIsGoLiveOpen}
        />
      </div>
    </MainLayout>
  );
};

export default Home;
