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
    <div className="min-h-screen bg-luxury-dark">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      <MainNav />
      
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <div className="container mx-auto">
          <div className="flex gap-6">
            {/* Left Sidebar - Hidden on mobile, shown on lg screens */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-[280px] flex-shrink-0"
            >
              <div className="sticky top-20 glass-effect rounded-xl p-4">
                <LeftSidebar />
              </div>
            </motion.div>

            {/* Main Content */}
            <main className="flex-1 max-w-[680px] mx-auto w-full px-4 lg:px-0">
              <div className="space-y-4">
                {session && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-effect rounded-xl p-4"
                    >
                      <StoryReel />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-effect rounded-xl p-4"
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

            {/* Right Sidebar - Hidden on mobile, shown on lg screens */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-[320px] flex-shrink-0"
            >
              <div className="sticky top-20 glass-effect rounded-xl p-4">
                <RightSidebar />
              </div>
            </motion.div>
          </div>
        </div>
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