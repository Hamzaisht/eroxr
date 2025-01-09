import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MainNav } from "@/components/MainNav";
import { LeftSidebar } from "@/components/home/LeftSidebar";
import { RightSidebar } from "@/components/home/RightSidebar";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { MainFeed } from "@/components/home/MainFeed";
import { TrendingTopics } from "@/components/home/TrendingTopics";
import { SuggestedCreators } from "@/components/home/SuggestedCreators";

export default function Index() {
  const session = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      
      <MainNav />
      
      <div className="flex">
        {/* Left Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block fixed left-0 top-16 bottom-0 z-30"
        >
          <LeftSidebar />
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] w-full lg:ml-72 lg:mr-80">
          <div className="max-w-[900px] mx-auto px-4 py-6 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CreatePostArea />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MainFeed />
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-80 fixed right-0 top-16 bottom-0 z-30"
        >
          <div className="h-full bg-luxury-dark/95 backdrop-blur-lg border-l border-luxury-neutral/5">
            <ScrollArea className="h-full p-4">
              <div className="space-y-6">
                <TrendingTopics />
                <SuggestedCreators />
              </div>
            </ScrollArea>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}