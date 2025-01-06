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
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark to-luxury-dark/95">
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Main Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-luxury-neutral">Your Feed</h1>
              <div className="relative">
                <Bell className="h-6 w-6 text-luxury-neutral cursor-pointer hover:text-luxury-primary transition-colors" />
                {newNotifications > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-luxury-primary"
                    variant="secondary"
                  >
                    {newNotifications}
                  </Badge>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <StoryReel />
              
              <CreatePostArea
                onOpenCreatePost={() => setIsCreatePostOpen(true)}
                onFileSelect={setSelectedFiles}
                onOpenGoLive={() => setIsGoLiveOpen(true)}
                isPayingCustomer={isPayingCustomer}
              />

              <CreatorsFeed />
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-6 shadow-lg backdrop-blur-lg sticky top-24">
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
  );
};

export default Home;