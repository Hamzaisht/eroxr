
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/feed/PostCard";
import { FeedTabs } from "./FeedTabs";
import { useToast } from "@/hooks/use-toast";
import { usePostActions } from "@/components/feed/usePostActions";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeedContainerProps {
  userId?: string;
  isPayingCustomer: boolean | null;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  onOpenGoLive: () => void;
}

export const FeedContainer = ({
  userId,
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: FeedContainerProps) => {
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [hasInteracted, setHasInteracted] = useState(false);
  const queryClient = useQueryClient();
  const { handleLike, handleDelete } = usePostActions();
  const { toast } = useToast();

  const { data: posts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          creator:profiles(id, username, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (activeTab === "feed" && userId) {
        const { data: following } = await supabase
          .from("followers")
          .select("following_id")
          .eq("follower_id", userId);
        
        if (following?.length) {
          const followingIds = following.map(f => f.following_id);
          query = query.in("creator_id", [userId, ...followingIds]);
        } else {
          query = query.eq("creator_id", userId);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    }
  });

  const onLikePost = async (postId: string) => {
    try {
      await handleLike(postId);
      if (!hasInteracted) {
        toast({
          title: "Great choice! 🌟",
          description: "We'll show you more content like this.",
        });
        setHasInteracted(true);
      }
    } catch (error) {
      console.error("Like error:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
        <p className="text-luxury-neutral text-sm">Curating your personalized feed...</p>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
      >
        <Alert className="bg-luxury-darker border-red-500/20 mb-4 max-w-md w-full">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertDescription>
            Failed to load your feed. {error?.message || "Please try again."}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => refetch()} 
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <FeedTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        onOpenGoLive={onOpenGoLive}
      />

      {/* Empty State with CTA */}
      {posts?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-4"
        >
          <h3 className="text-xl font-semibold text-luxury-neutral">No posts yet</h3>
          <p className="text-luxury-neutral/60 max-w-md mx-auto">
            Start by following some creators or share your own content to get the conversation going!
          </p>
          <Button
            onClick={onOpenCreatePost}
            className="mt-4 bg-luxury-primary hover:bg-luxury-primary/90"
          >
            Create Your First Post
          </Button>
        </motion.div>
      )}

      {/* Posts Grid */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {posts?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <PostCard
                post={post}
                onLike={onLikePost}
                onDelete={handleDelete}
                currentUserId={userId}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};
