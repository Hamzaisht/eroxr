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
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const session = useSession();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const { toast } = useToast();

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch trending data
  const { data: trendingData } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("content, media_url, likes_count, comments_count, tags")
        .order("likes_count", { ascending: false })
        .limit(5);

      if (postsError) throw postsError;

      // Process tags to get trending hashtags
      const allTags = posts?.flatMap(post => post.tags || []) || [];
      const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const trendingTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({
          tag,
          count,
          percentageIncrease: Math.floor(Math.random() * 30) + 10 // Simulated growth for demo
        }));

      return {
        trendingTags,
        posts
      };
    },
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleError = (error: Error) => {
    console.error("Error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Something went wrong. Please try again later.",
    });
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-luxury-dark/50 border-b border-luxury-primary/10">
        <MainNav />
      </div>
      
      {/* Main Layout */}
      <div className="flex min-h-screen pt-16">
        {/* Main Content Area */}
        <main className="flex-1 w-full xl:mr-[320px]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl overflow-hidden"
            >
              <CreatePostArea 
                onOpenCreatePost={() => setIsCreatePostOpen(true)}
                onFileSelect={setSelectedFiles}
                onOpenGoLive={() => setIsGoLiveOpen(true)}
                isPayingCustomer={profile?.is_paying_customer}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <MainFeed 
                isPayingCustomer={profile?.is_paying_customer}
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
          className="hidden xl:block fixed right-0 top-16 w-[320px] h-[calc(100vh-4rem)] neo-blur border-l border-luxury-primary/10 z-40"
        >
          <ScrollArea className="h-full p-4">
            <RightSidebar trendingData={trendingData} />
          </ScrollArea>
        </motion.aside>
      </div>
    </div>
  );
}