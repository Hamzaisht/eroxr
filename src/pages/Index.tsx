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

        return profileData;
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
}