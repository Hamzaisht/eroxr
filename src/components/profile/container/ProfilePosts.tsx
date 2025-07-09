
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Crown, Heart, Eye, MessageCircle } from 'lucide-react';

interface ProfilePostsProps {
  profileId: string;
}

export const ProfilePosts = ({ profileId }: ProfilePostsProps) => {
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
          className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 group cursor-pointer"
        >
          {/* Media Preview */}
          {post.media_assets && post.media_assets.length > 0 && (
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-700/30">
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
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <p className="text-slate-200 line-clamp-3 leading-relaxed">
              {post.content}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
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
                    className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-lg"
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
