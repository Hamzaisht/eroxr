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
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [isErosDialogOpen, setIsErosDialogOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const session = useSession();
  const { toast } = useToast();

  // Add scroll position tracking
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsButtonVisible(currentScrollY <= lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        {/* Floating Action Button with visibility animation */}
        <AnimatePresence>
          {isButtonVisible && (
            <motion.div 
              className="fixed bottom-6 right-6 z-50 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setShowFloatingMenu(true)}
              onMouseLeave={() => setShowFloatingMenu(false)}
            >
              <AnimatePresence>
                {showFloatingMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-full right-0 mb-4 space-y-2 min-w-[180px]"
                  >
                    <Button
                      onClick={() => setIsErosDialogOpen(true)}
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
                    >
                      <Video className="h-4 w-4" />
                      Create Eros
                    </Button>
                    <Button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="w-full flex items-center gap-2 bg-luxury-dark hover:bg-luxury-dark/90"
                    >
                      <Plus className="h-4 w-4" />
                      Create Post
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg flex items-center justify-center"
              >
                <Video className="h-6 w-6 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
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

      <Dialog open={isErosDialogOpen} onOpenChange={setIsErosDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="eros-upload"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast({
                      title: "Video selected",
                      description: "Your Eros video is ready to be edited",
                    });
                    setIsErosDialogOpen(false);
                  }
                }}
              />
              <Button
                onClick={() => document.getElementById('eros-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Video className="h-8 w-8" />
                  <span>Upload video</span>
                  <span className="text-sm text-luxury-neutral/60">
                    Maximum length: 60 seconds
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </HomeLayout>
  );
};

export default Home;