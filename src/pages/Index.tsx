import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MainNav } from "@/components/MainNav";
import { MainFeed } from "@/components/home/MainFeed";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const session = useSession();
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
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!session?.user?.id,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

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
    return null;
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
              transition={{ duration: 0.5 }}
            >
              <CreatePostArea 
                isPayingCustomer={profile?.is_paying_customer}
                onGoLive={() => setIsGoLiveOpen(true)}
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
                userRole={profile?.role}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}