
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/feed/PostCard";
import { FeedTabs } from "./FeedTabs";
import { useToast } from "@/hooks/use-toast";
import { usePostActions } from "@/components/feed/usePostActions";

interface FeedContainerProps {
  userId?: string;
  isPayingCustomer: boolean | null;
  onOpenCreatePost: () => void;
  onFileSelect: () => void;
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
  const queryClient = useQueryClient();
  const { handleLike, handleDelete } = usePostActions();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
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
        // For feed tab, get posts from followed creators
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

      if (error) {
        console.error("Feed query error:", error);
        throw error;
      }

      return data || [];
    }
  });

  const onLikePost = async (postId: string) => {
    try {
      await handleLike(postId);
    } catch (error) {
      console.error("Like error:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const onDeletePost = async (postId: string, creatorId: string) => {
    try {
      await handleDelete(postId, creatorId);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <FeedTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        onOpenGoLive={onOpenGoLive}
      />
      <div className="space-y-6">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLikePost}
            onDelete={onDeletePost}
            currentUserId={userId}
          />
        ))}
      </div>
    </div>
  );
};
