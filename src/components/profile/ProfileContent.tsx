
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
          media_assets(*),
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
        case 'photos':
          // Filter for posts with image media
          query = query.not('media_assets', 'is', null);
          break;
        case 'videos':
          // Filter for posts with video media
          query = query.not('media_assets', 'is', null);
          break;
        case 'audio':
          // Filter for posts with audio media
          query = query.not('media_assets', 'is', null);
          break;
        case 'liked':
          if (session?.user?.id) {
            const { data: likedPosts } = await supabase
              .from('post_likes')
              .select(`
                post_id,
                posts:posts(
                  *,
                  media_assets(*),
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
                media_assets: post.media_assets || [],
                creator: post.profiles
              })) || [];
            
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
          // This would need a tagging system
          setPosts([]);
          setLoading(false);
          return;
        case 'livestreams':
          // This would query live streams
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

      // Process posts to ensure proper media assets structure
      let processedPosts = data?.map(post => ({
        ...post,
        media_assets: post.media_assets || [],
        creator: post.profiles
      })) || [];

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

  // Memoized grid layout
  const gridContent = useMemo(() => {
    if (posts.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
            >
              <PostCard post={post} isOwnProfile={isOwnProfile} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }, [posts, isOwnProfile]);

  if (loading && posts.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-pulse"
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
            description: 'Photos will appear here when they are shared.'
          };
        case 'videos':
          return {
            icon: Video,
            title: 'No Videos Yet',
            description: 'Videos will appear here when they are shared.'
          };
        case 'audio':
          return {
            icon: Music,
            title: 'No Audio Content',
            description: 'Audio content will appear here when shared.'
          };
        default:
          return {
            icon: Image,
            title: `No ${activeTab} content`,
            description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will appear here when available.`
          };
      }
    };

    const emptyState = getEmptyStateContent();
    const EmptyIcon = emptyState.icon;

    return (
      <div className="w-full px-4 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <EmptyIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{emptyState.title}</h3>
          <p className="text-gray-400">{emptyState.description}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {gridContent}
      
      {/* Load More Section */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            onClick={loadMore}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More</span>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
