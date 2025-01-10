import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveNav } from "./InteractiveNav";
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";

export const MainLayout = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isErosDialogOpen, setIsErosDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      setIsInitialized(true);
    };

    checkSession();
  }, [session, navigate]);

  if (!isInitialized || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
        <div className="w-8 h-8 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/10 blur-3xl animate-pulse" />
      </div>
      
      <InteractiveNav />
      
      <main className="relative min-h-screen pl-20 w-full">
        <div className="min-h-screen w-full px-4 py-6">
          <Outlet />
        </div>

        {/* Single Floating Action Button */}
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
                  onClick={() => setIsCreatePostOpen(true)}
                  className="w-full flex items-center gap-2 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
                >
                  <Plus className="h-4 w-4" />
                  Create Post
                </Button>
                <Button
                  onClick={() => setIsErosDialogOpen(true)}
                  className="w-full flex items-center gap-2 bg-[#0D1117]/80 hover:bg-[#0D1117] backdrop-blur-sm"
                >
                  <Video className="h-4 w-4" />
                  Create Eros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg flex items-center justify-center"
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          >
            <Plus className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </main>

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
        <DialogContent className="sm:max-w-[425px] bg-[#0D1117]/95 backdrop-blur-xl border-luxury-primary/20">
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
                  }
                }}
              />
              <Button
                onClick={() => document.getElementById('eros-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors bg-[#0D1117]/20"
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
    </div>
  );
};