import { MainNav } from "@/components/MainNav";
import { motion } from "framer-motion";
import { StoryReel } from "@/components/StoryReel";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";

const Index = () => {
  const session = useSession();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      
      <MainNav />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 max-w-[2000px] relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-6">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="sticky top-20">
              <div className="glass-effect rounded-xl p-6 backdrop-blur-xl border border-luxury-primary/10">
                <LeftSidebar />
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {session && (
              <>
                <div className="glass-effect rounded-xl p-6 backdrop-blur-xl border border-luxury-primary/10">
                  <StoryReel />
                </div>
                <div className="neo-blur rounded-xl border border-luxury-primary/5">
                  <CreatePostArea
                    onOpenCreatePost={() => setIsCreatePostOpen(true)}
                    onFileSelect={setSelectedFiles}
                    onOpenGoLive={() => setIsGoLiveOpen(true)}
                    isPayingCustomer={isPayingCustomer}
                  />
                </div>
              </>
            )}
            <MainFeed
              isPayingCustomer={isPayingCustomer}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onFileSelect={setSelectedFiles}
              onOpenGoLive={() => setIsGoLiveOpen(true)}
            />
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="sticky top-20">
              <div className="glass-effect rounded-xl p-6 backdrop-blur-xl border border-luxury-primary/10">
                <RightSidebar />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>

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

export default Index;