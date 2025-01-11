import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MainNav } from "@/components/MainNav";
import { RightSidebar } from "@/components/home/RightSidebar";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { MainFeed } from "@/components/home/MainFeed";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const session = useSession();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (rolesError && rolesError.code !== 'PGRST116') {
          console.error("Roles fetch error:", rolesError);
          throw rolesError;
        }

        const userRole = roles && roles.length > 0 ? roles[0].role : 'user';

        return {
          ...profileData,
          role: userRole
        };
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("content, media_url, likes_count, comments_count, tags")
        .order("likes_count", { ascending: false })
        .limit(5);

      if (postsError) throw postsError;

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
          percentageIncrease: Math.floor(Math.random() * 30) + 10
        }));

      return {
        trendingTags,
        posts
      };
    },
    refetchInterval: 300000
  });

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-luxury-dark/50 border-b border-luxury-primary/10">
        <MainNav />
      </div>
      
      <div className="flex min-h-screen pt-16">
        <main className="flex-1 w-full">
          <div className="max-w-full mx-auto px-4 py-6">
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
              className="mt-6 w-full"
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
      </div>
    </div>
  );
};