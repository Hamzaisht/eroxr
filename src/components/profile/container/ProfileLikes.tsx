
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { usePostActions } from "@/hooks/usePostActions";

interface ProfileLikesProps {
  userId: string;
}

export const ProfileLikes = ({ userId }: ProfileLikesProps) => {
  const { handleLike, handleDelete } = usePostActions();

  const { data: likedPosts, isLoading, error } = useQuery({
    queryKey: ['user-likes', userId],
    queryFn: async () => {
      console.log('Fetching likes for user:', userId);
      const { data, error } = await supabase
        .from('post_likes')
        .select(`
          *,
          post:posts(
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
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Likes fetch error:', error);
        throw error;
      }

      console.log('Likes fetched:', data?.length || 0);

      // Transform the data to match expected format
      return data?.map(like => {
        const post = like.post as any;
        
        return {
          ...post,
          creator: Array.isArray(post.creator) ? post.creator[0] : post.creator,
          isLiked: true,
          isSaved: false,
          likedAt: like.created_at
        };
      }).filter(post => post && post.visibility === 'public') || [];
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
    console.error('ProfileLikes error:', error);
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-2">Failed to load liked posts</p>
        <p className="text-gray-500 text-sm">Please try refreshing the page</p>
      </div>
    );
  }

  if (!likedPosts?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-luxury-primary/10 rounded-full flex items-center justify-center">
          <Heart className="w-12 h-12 text-luxury-primary" />
        </div>
        <h3 className="text-xl font-semibold text-luxury-neutral mb-2">No liked posts</h3>
        <p className="text-luxury-muted mb-4">Posts you like will appear here</p>
        <div className="flex items-center justify-center gap-2 text-sm text-luxury-muted/60">
          <Lock className="w-4 h-4" />
          <span>Only visible to you</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-luxury-neutral">Liked Posts</h2>
        <div className="flex items-center gap-2 text-sm text-luxury-muted/60">
          <Lock className="w-4 h-4" />
          <span>Private collection</span>
        </div>
      </div>
      
      {likedPosts.map((post) => (
        <EnhancedPostCard
          key={post.id}
          post={post}
          currentUserId={userId}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
