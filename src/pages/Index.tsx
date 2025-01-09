import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MainNav } from "@/components/MainNav";
import { RightSidebar } from "@/components/home/RightSidebar";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { MainFeed } from "@/components/home/MainFeed";
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
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <MainNav />
      </div>
      
      {/* Main Layout */}
      <div className="flex min-h-screen pt-16">
        {/* Main Content Area */}
        <main className="flex-1 w-full xl:mr-[320px]">
          <div className="max-w-2xl mx-auto px-4 py-6">
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
              className="mt-6"
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

        {/* Right Sidebar - Fixed */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:block fixed right-0 top-16 w-[320px] h-[calc(100vh-4rem)] bg-[#0D1117] border-l border-luxury-neutral/10 z-40"
        >
          <ScrollArea className="h-full p-4">
            <RightSidebar />
          </ScrollArea>
        </motion.aside>
      </div>
    </div>
  );
}