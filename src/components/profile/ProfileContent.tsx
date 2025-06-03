
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/profile/PostCard";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, Image, Video, Music } from "lucide-react";

interface ProfileData {
  id: string;
  username: string;
  is_creator: boolean;
}

interface ProfileContentProps {
  profile: ProfileData;
  activeTab: string;
  isOwnProfile: boolean;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  visibility: string;
  is_ppv: boolean;
  ppv_amount?: number;
  likes_count: number;
  comments_count: number;
  view_count: number;
  media_assets: any[];
  creator?: any;
}

export const ProfileContent = ({ profile, activeTab, isOwnProfile }: ProfileContentProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const session = useSession();

  useEffect(() => {
    fetchContent();
  }, [activeTab, profile.id]);

  const fetchContent = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      
      const limit = 20;
      const offset = (pageNum - 1) * limit;
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters based on active tab
      switch (activeTab) {
        case 'public':
          query = query.eq('visibility', 'public').eq('is_ppv', false);
          break;
        case 'premium':
          query = query.or('visibility.eq.subscribers_only,is_ppv.eq.true');
          break;
        case 'liked':
          if (session?.user?.id) {
            const { data: likedPosts } = await supabase
              .from('post_likes')
              .select(`
                post_id,
                posts:posts(
                  *,
                  profiles:creator_id(username, avatar_url)
                )
              `)
              .eq('user_id', session.user.id)
              .range(offset, offset + limit - 1);
            
            const validPosts: Post[] = likedPosts
              ?.map(like => like.posts)
              .filter((post): post is any => post !== null && typeof post === 'object' && !Array.isArray(post))
              .map(post => ({
                id: post.id,
                content: post.content || '',
                created_at: post.created_at,
                visibility: post.visibility || 'public',
                is_ppv: post.is_ppv || false,
                ppv_amount: post.ppv_amount,
                likes_count: post.likes_count || 0,
                comments_count: post.comments_count || 0,
                view_count: post.view_count || 0,
                media_assets: [],
                creator: post.profiles
              })) || [];
            
            // Fetch media assets for liked posts
            for (const post of validPosts) {
              const { data: mediaAssets } = await supabase
                .from('media_assets')
                .select('*')
                .eq('metadata->>post_id', post.id);
              
              if (mediaAssets) {
                post.media_assets = mediaAssets.map(asset => ({
                  ...asset,
                  url: supabase.storage.from('media').getPublicUrl(asset.storage_path).data.publicUrl
                }));
              }
            }
            
            if (pageNum === 1) {
              setPosts(validPosts);
            } else {
              setPosts(prev => [...prev, ...validPosts]);
            }
            setHasMore(validPosts.length === limit);
            setLoading(false);
            return;
          }
          break;
        case 'tagged':
          setPosts([]);
          setLoading(false);
          return;
        case 'livestreams':
          setPosts([]);
          setLoading(false);
          return;
      }

      // If not own profile, filter out private content
      if (!isOwnProfile) {
        query = query.neq('visibility', 'private');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process posts and fetch their media assets
      let processedPosts = data?.map(post => ({
        ...post,
        media_assets: [],
        creator: post.profiles
      })) || [];

      // Fetch media assets for each post using the correct relationship
      for (const post of processedPosts) {
        const { data: mediaAssets } = await supabase
          .from('media_assets')
          .select('*')
          .eq('metadata->>post_id', post.id);
        
        if (mediaAssets && mediaAssets.length > 0) {
          post.media_assets = mediaAssets.map(asset => ({
            ...asset,
            url: supabase.storage.from('media').getPublicUrl(asset.storage_path).data.publicUrl,
            thumbnail_url: asset.metadata?.thumbnail_url ? 
              supabase.storage.from('media').getPublicUrl(asset.metadata.thumbnail_url).data.publicUrl : 
              null
          }));
        }
      }

      // Additional filtering for media types
      if (activeTab === 'photos') {
        processedPosts = processedPosts.filter(post => 
          post.media_assets.some(asset => asset.media_type === 'image' || asset.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        );
      } else if (activeTab === 'videos') {
        processedPosts = processedPosts.filter(post => 
          post.media_assets.some(asset => asset.media_type === 'video' || asset.url?.match(/\.(mp4|webm|mov|avi)$/i))
        );
      } else if (activeTab === 'audio') {
        processedPosts = processedPosts.filter(post => 
          post.media_assets.some(asset => asset.media_type === 'audio' || asset.url?.match(/\.(mp3|wav|ogg|m4a)$/i))
        );
      }

      if (pageNum === 1) {
        setPosts(processedPosts as Post[]);
      } else {
        setPosts(prev => [...prev, ...processedPosts as Post[]]);
      }
      
      setHasMore(processedPosts.length === limit);
    } catch (error) {
      console.error('Error fetching content:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchContent(nextPage);
    }
  };

  // Memoized grid layout with enhanced styling
  const gridContent = useMemo(() => {
    if (posts.length === 0) return null;

    return (
      <div className="w-full px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                  layout: { duration: 0.4 }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <PostCard post={post} isOwnProfile={isOwnProfile} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }, [posts, isOwnProfile]);

  if (loading && posts.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-pulse shadow-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    const getEmptyStateContent = () => {
      switch (activeTab) {
        case 'photos':
          return {
            icon: Image,
            title: 'No Photos Yet',
            description: 'Photos will appear here when they are shared.',
            gradient: 'from-orange-500 to-red-500'
          };
        case 'videos':
          return {
            icon: Video,
            title: 'No Videos Yet',
            description: 'Videos will appear here when they are shared.',
            gradient: 'from-red-500 to-pink-500'
          };
        case 'audio':
          return {
            icon: Music,
            title: 'No Audio Content',
            description: 'Audio content will appear here when shared.',
            gradient: 'from-yellow-500 to-orange-500'
          };
        default:
          return {
            icon: Image,
            title: `No ${activeTab} content`,
            description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will appear here when available.`,
            gradient: 'from-cyan-500 to-purple-500'
          };
      }
    };

    const emptyState = getEmptyStateContent();
    const EmptyIcon = emptyState.icon;

    return (
      <div className="w-full px-4 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className={`w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r ${emptyState.gradient} bg-opacity-20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl`}>
            <EmptyIcon className="w-16 h-16 text-white/80" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{emptyState.title}</h3>
          <p className="text-gray-400 text-lg">{emptyState.description}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 min-h-screen">
      {gridContent}
      
      {/* Enhanced Load More Section */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-16 px-4"
        >
          <motion.button
            onClick={loadMore}
            disabled={loading}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 transition-all duration-300 disabled:opacity-50 shadow-2xl hover:shadow-cyan-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg font-medium">Loading...</span>
              </>
            ) : (
              <span className="text-lg font-medium">Load More Content</span>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
