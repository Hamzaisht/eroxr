
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { usePostActions } from "@/hooks/usePostActions";

interface ProfilePostsProps {
  profileId: string;
}

export const ProfilePosts = ({ profileId }: ProfilePostsProps) => {
  const { user } = useAuth();
  const { handleLike, handleDelete } = usePostActions();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['profile-posts', profileId],
    queryFn: async () => {
      console.log('Fetching posts for profile:', profileId);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:profiles!posts_creator_id_fkey(
            id, 
            username,
            avatar_url,
            bio,
            location
          ),
          media_assets!media_assets_post_id_fkey(
            id,
            storage_path,
            media_type,
            mime_type,
            original_name,
            alt_text,
            post_id,
            file_size,
            access_level
          ),
          post_likes(
            user_id
          )
        `)
        .eq('creator_id', profileId)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Posts fetch error:', error);
        throw error;
      }

      console.log('Posts fetched:', data?.length || 0);

      // Transform the data to match expected format
      return data?.map(post => {
        const isLiked = user?.id ? post.post_likes?.some((like: any) => like.user_id === user.id) : false;
        
        return {
          ...post,
          creator: Array.isArray(post.creator) ? post.creator[0] : post.creator,
          isLiked,
          isSaved: false
        };
      }) || [];
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-luxury-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    console.error('ProfilePosts error:', error);
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-2">Failed to load posts</p>
        <p className="text-gray-500 text-sm">Please try refreshing the page</p>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-luxury-primary/10 rounded-full flex items-center justify-center">
          <Plus className="w-12 h-12 text-luxury-primary" />
        </div>
        <h3 className="text-xl font-semibold text-luxury-neutral mb-2">No posts yet</h3>
        <p className="text-luxury-muted">
          {user?.id === profileId ? "Share your first masterpiece!" : "This user hasn't posted anything yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {posts.map((post) => (
        <EnhancedPostCard
          key={post.id}
          post={post}
          currentUserId={user?.id}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
