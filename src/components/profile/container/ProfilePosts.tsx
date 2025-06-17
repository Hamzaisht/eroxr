
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Crown, Star, Sparkles } from "lucide-react";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { usePostActions } from "@/hooks/usePostActions";
import { Button } from "@/components/ui/button";

interface ProfilePostsProps {
  profileId: string;
}

export const ProfilePosts = ({ profileId }: ProfilePostsProps) => {
  const { user } = useAuth();
  const { handleLike, handleDelete } = usePostActions();
  const isOwnProfile = user?.id === profileId;

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['profile-posts', profileId],
    queryFn: async () => {
      console.log('🎨 Fetching divine creations for profile:', profileId);
      
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
        console.error('❌ Divine creations fetch error:', error);
        throw error;
      }

      console.log('✨ Raw posts data fetched:', data);

      return data?.map(post => {
        const isLiked = user?.id ? post.post_likes?.some((like: any) => like.user_id === user.id) : false;
        
        // Transform the post data to match expected structure
        const transformedPost = {
          ...post,
          creator: Array.isArray(post.creator) ? post.creator[0] : post.creator,
          isLiked,
          isSaved: false,
          // Transform media_assets to match expected structure
          media_url: post.media_assets?.map((asset: any) => {
            // Use the appropriate bucket based on media type
            const bucket = asset.media_type === 'video' ? 'media' : 'media';
            const { data: publicUrl } = supabase.storage
              .from(bucket)
              .getPublicUrl(asset.storage_path);
            return publicUrl.publicUrl;
          }) || []
        };

        console.log('✨ Transformed post:', transformedPost);
        return transformedPost;
      }) || [];
    },
    staleTime: 30000,
  });

  const handleCreatePost = () => {
    // Navigate to create post or open dialog
    console.log('Create new divine post');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    console.error('ProfilePosts error:', error);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-12"
      >
        <Crown className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <p className="text-red-400 mb-2 text-xl">Failed to load divine creations</p>
        <p className="text-luxury-muted mb-6">The gods seem to be busy. Please try again.</p>
        <Button 
          onClick={() => refetch()}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-2xl font-semibold"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (!posts?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-400/20 to-luxury-primary/20 rounded-full flex items-center justify-center border-2 border-yellow-400/30"
        >
          <Crown className="w-16 h-16 text-yellow-400" />
        </motion.div>
        
        <h3 className="text-3xl font-bold text-luxury-neutral mb-4">
          {isOwnProfile ? "Create Your First Divine Masterpiece" : "No Divine Creations Yet"}
        </h3>
        
        <p className="text-luxury-muted text-lg mb-8 max-w-md mx-auto">
          {isOwnProfile 
            ? "Share your divine inspiration with mortals across the realm"
            : "This divine creator hasn't blessed us with their creations yet"
          }
        </p>
        
        {isOwnProfile && (
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-8 py-4 rounded-2xl font-semibold text-lg shadow-luxury"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Divine Post
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="w-8 h-8 text-yellow-400" />
          <h2 className="text-4xl font-bold text-luxury-neutral">Divine Creations</h2>
          <Star className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-luxury-muted text-lg">
          Behold the masterpieces crafted by divine hands
        </p>
        {isOwnProfile && (
          <motion.div className="mt-6">
            <Button 
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-2xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Post
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Posts Grid */}
      <motion.div 
        className="grid gap-8 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Divine Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/10 via-luxury-primary/10 to-yellow-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative">
                <EnhancedPostCard
                  post={post}
                  currentUserId={user?.id}
                  onLike={handleLike}
                  onDelete={handleDelete}
                />
              </div>
              
              {/* Sparkling Effect on Hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-4 bg-gray-800/50 rounded-lg text-sm text-gray-400"
        >
          <p>Debug Info:</p>
          <p>Profile ID: {profileId}</p>
          <p>User ID: {user?.id}</p>
          <p>Is Own Profile: {isOwnProfile.toString()}</p>
          <p>Posts Count: {posts?.length || 0}</p>
        </motion.div>
      )}
    </div>
  );
};
