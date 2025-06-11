
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Bookmark, Lock } from "lucide-react";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { usePostActions } from "@/hooks/usePostActions";

interface ProfileBookmarksProps {
  userId: string;
}

export const ProfileBookmarks = ({ userId }: ProfileBookmarksProps) => {
  const { handleLike, handleDelete } = usePostActions();

  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['user-bookmarks', userId],
    queryFn: async () => {
      console.log('Fetching bookmarks for user:', userId);
      const { data, error } = await supabase
        .from('post_saves')
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
            ),
            post_likes(
              user_id
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Bookmarks fetch error:', error);
        throw error;
      }

      console.log('Bookmarks fetched:', data?.length || 0);

      // Transform the data to match expected format
      return data?.map(bookmark => {
        const post = bookmark.post as any;
        const isLiked = post.post_likes?.some((like: any) => like.user_id === userId) || false;
        
        return {
          ...post,
          creator: Array.isArray(post.creator) ? post.creator[0] : post.creator,
          isLiked,
          isSaved: true,
          savedAt: bookmark.created_at
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
    console.error('ProfileBookmarks error:', error);
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-2">Failed to load bookmarks</p>
        <p className="text-gray-500 text-sm">Please try refreshing the page</p>
      </div>
    );
  }

  if (!bookmarks?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-luxury-primary/10 rounded-full flex items-center justify-center">
          <Bookmark className="w-12 h-12 text-luxury-primary" />
        </div>
        <h3 className="text-xl font-semibold text-luxury-neutral mb-2">No saved posts</h3>
        <p className="text-luxury-muted mb-4">Posts you save will appear here</p>
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
        <h2 className="text-2xl font-bold text-luxury-neutral">Saved Posts</h2>
        <div className="flex items-center gap-2 text-sm text-luxury-muted/60">
          <Lock className="w-4 h-4" />
          <span>Private collection</span>
        </div>
      </div>
      
      {bookmarks.map((post) => (
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
