import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";
import { StoryReel } from "@/components/StoryReel";
import { useToast } from "@/hooks/use-toast";
import { Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const session = useSession();
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

  if (!session) return null;

  return (
    <HomeLayout>
      <div className="w-full max-w-[2000px] mx-auto px-0">
        <div className="mb-6">
          <StoryReel />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <MainFeed
            isPayingCustomer={isPayingCustomer}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onFileSelect={setSelectedFiles}
            onOpenGoLive={() => setIsGoLiveOpen(true)}
          />
          <RightSidebar />
        </div>

        {/* Floating Action Button */}
        <div 
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setShowFloatingMenu(true)}
          onMouseLeave={() => setShowFloatingMenu(false)}
        >
          <AnimatePresence>
            {showFloatingMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full right-0 mb-4 space-y-2"
              >
                <Button
                  onClick={() => setIsGoLiveOpen(true)}
                  className="w-full flex items-center gap-2 bg-luxury-primary hover:bg-luxury-primary/90"
                >
                  <Video className="h-4 w-4" />
                  Create Eros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
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
    </HomeLayout>
  );
};

export default Home;