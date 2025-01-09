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
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      
      <MainNav />
      
      <div className="flex pt-16">
        {/* Left Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 z-30"
        >
          <LeftSidebar />
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] w-full lg:ml-64 lg:mr-80">
          <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
            {session && (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="neo-blur rounded-xl p-4"
                >
                  <StoryReel />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="neo-blur rounded-xl p-4"
                >
                  <CreatePostArea
                    onOpenCreatePost={() => setIsCreatePostOpen(true)}
                    onFileSelect={setSelectedFiles}
                    onOpenGoLive={() => setIsGoLiveOpen(true)}
                    isPayingCustomer={isPayingCustomer}
                  />
                </motion.div>
              </>
            )}
            <MainFeed
              isPayingCustomer={isPayingCustomer}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onFileSelect={setSelectedFiles}
              onOpenGoLive={() => setIsGoLiveOpen(true)}
            />
          </div>
        </main>

        {/* Right Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-80 fixed right-0 top-16 bottom-0 z-30"
        >
          <div className="h-full overflow-hidden">
            <RightSidebar />
          </div>
        </motion.aside>
      </div>

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