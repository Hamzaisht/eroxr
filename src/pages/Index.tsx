import { MainNav } from "@/components/MainNav";
import { motion } from "framer-motion";
import { StoryReel } from "@/components/StoryReel";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { UploadShortButton } from "@/components/home/UploadShortButton";

const Index = () => {
  const session = useSession();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      <MainNav />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 max-w-[2000px] relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {session && (
              <>
                <div className="glass-effect rounded-xl p-6">
                  <StoryReel />
                </div>
                <div className="neo-blur rounded-xl">
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
              <div className="glass-effect rounded-xl p-6">
                <RightSidebar />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      <UploadShortButton />

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