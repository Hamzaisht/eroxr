import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { StoryReel } from "@/components/StoryReel";
import { SearchBar } from "@/components/home/SearchBar";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { SuggestedCreators } from "@/components/home/SuggestedCreators";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { motion } from "framer-motion";

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const session = useSession();
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

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Main Feed */}
          <div className="space-y-6">
            <StoryReel />
            
            <CreatePostArea
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onFileSelect={setSelectedFiles}
              onOpenGoLive={() => setIsGoLiveOpen(true)}
              isPayingCustomer={isPayingCustomer}
            />

            <CreatorsFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-luxury-neutral/10 bg-luxury-dark/50 p-4 shadow-lg backdrop-blur-lg sticky top-24"
            >
              <SearchBar />
              <SuggestedCreators />
            </motion.div>
          </div>
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
    </div>
  );
};

export default Home;