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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const session = useSession();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

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

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      
      <MainNav />
      
      <div className="flex min-h-screen pt-16">
        {/* Left Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-72 bg-[#0D1117] border-r border-luxury-neutral/10 sticky top-16 h-[calc(100vh-4rem)]"
        >
          <ScrollArea className="h-full">
            <LeftSidebar />
          </ScrollArea>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CreatePostArea 
                onOpenCreatePost={() => setIsCreatePostOpen(true)}
                onFileSelect={setSelectedFiles}
                onOpenGoLive={() => setIsGoLiveOpen(true)}
                isPayingCustomer={isPayingCustomer}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MainFeed 
                isPayingCustomer={isPayingCustomer}
                onOpenCreatePost={() => setIsCreatePostOpen(true)}
                onFileSelect={setSelectedFiles}
                onOpenGoLive={() => setIsGoLiveOpen(true)}
              />
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:block w-80 bg-[#0D1117] border-l border-luxury-neutral/10 sticky top-16 h-[calc(100vh-4rem)]"
        >
          <ScrollArea className="h-full p-4">
            <div className="space-y-6">
              <TrendingTopics />
              <SuggestedCreators />
            </div>
          </ScrollArea>
        </motion.aside>
      </div>
    </div>
  );
}