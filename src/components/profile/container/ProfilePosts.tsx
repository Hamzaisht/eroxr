
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Crown, Heart, Eye, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { trackView } from '@/utils/viewTracking';

interface ProfilePostsProps {
  profileId: string;
}

export const ProfilePosts = ({ profileId }: ProfilePostsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const { data: posts, isLoading } = useQuery({
    queryKey: ['profile-posts', profileId],
    queryFn: async () => {
      console.log('🎯 ProfilePosts: Fetching posts for:', profileId);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          content_extended,
          created_at,
          likes_count,
          comments_count,
          view_count,
          tags,
          visibility,
          media_assets (
            id,
            media_type,
            storage_path,
            alt_text
          )
        `)
        .eq('creator_id', profileId)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ProfilePosts: Fetch failed:', error);
        throw error;
      }
      
      console.log('✅ ProfilePosts: Found posts:', data?.length || 0);
      return data || [];
    },
    staleTime: 60000,
  });

  // Check user's likes on posts
  useQuery({
    queryKey: ['user-post-likes', user?.id],
    queryFn: async () => {
      if (!user || !posts) return [];
      
      const { data } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', posts.map(p => p.id));
      
      if (data) {
        setLikedPosts(new Set(data.map(like => like.post_id)));
      }
      return data;
    },
    enabled: !!user && !!posts,
  });

  // Secure view tracking with the new system
  const handlePostClick = async (postId: string) => {
    console.log('🎯 Tracking view for post:', postId);
    
    const result = await trackView({
      contentId: postId,
      contentType: 'post',
      userId: user?.id
    });

    if (result.tracked) {
      // Only show success toast, don't spam user
      console.log('✅ Post view tracked successfully');
      // Refresh the posts to show updated view count
      queryClient.invalidateQueries({ queryKey: ['profile-posts', profileId] });
    } else if (result.nextAllowedView) {
      const nextViewTime = new Date(result.nextAllowedView);
      const minutes = Math.ceil((nextViewTime.getTime() - Date.now()) / (1000 * 60));
      console.log(`⏰ View cooldown active for ${minutes} minutes`);
    }
  };

  // Like toggle mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId, isLiking }: { postId: string; isLiking: boolean }) => {
      if (isLiking) {
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user!.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user!.id);
        if (error) throw error;
      }
    },
    onSuccess: (_, { postId, isLiking }) => {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiking) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ['profile-posts', profileId] });
      toast({
        title: isLiking ? "💖 Post liked!" : "💔 Like removed",
        description: isLiking ? "Added to your favorites" : "Removed from favorites",
        duration: 2000,
      });
    },
  });

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }
    
    const isCurrentlyLiked = likedPosts.has(postId);
    likeMutation.mutate({ postId, isLiking: !isCurrentlyLiked });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 animate-pulse">
            <div className="w-full h-48 bg-slate-700/50 rounded-xl mb-4" />
            <div className="h-4 bg-slate-700/50 rounded mb-2" />
            <div className="h-3 bg-slate-700/50 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Crown className="w-16 h-16 mx-auto text-slate-400 mb-4" />
        <h3 className="text-2xl font-bold text-slate-200 mb-2">No Divine Creations Yet</h3>
        <p className="text-slate-400">This creator hasn't shared any content yet.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => handlePostClick(post.id)}
          className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 group cursor-pointer hover:border-purple-400/30 transition-all duration-300"
        >
          {/* Media Preview */}
          {post.media_assets && post.media_assets.length > 0 && (
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-700/30 relative">
              {post.media_assets[0].media_type === 'image' ? (
                <img
                  src={`${supabase.storage.from('media').getPublicUrl(post.media_assets[0].storage_path).data.publicUrl}`}
                  alt={post.media_assets[0].alt_text || 'Post content'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <video
                  src={`${supabase.storage.from('media').getPublicUrl(post.media_assets[0].storage_path).data.publicUrl}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                />
              )}
              
              {/* Overlay for view indicator */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye className="w-3 h-3 inline mr-1" />
                Click to view
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <p className="text-slate-200 line-clamp-3 leading-relaxed">
              {post.content}
            </p>

            {/* Interactive Stats */}
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleLike(e, post.id)}
                  className={`h-8 px-2 transition-colors ${
                    likedPosts.has(post.id) 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-slate-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  <span>{post.likes_count || 0}</span>
                </Button>
                
                <div className="flex items-center gap-1 text-slate-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </div>
                
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count || 0}</span>
                </div>
              </div>
              
              <span className="text-xs">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-slate-400">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
