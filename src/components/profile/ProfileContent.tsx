
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { PostCard } from "@/components/profile/PostCard";
import { Lock, Heart, Eye, MessageCircle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

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
}

export const ProfileContent = ({ profile, activeTab, isOwnProfile }: ProfileContentProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    fetchContent();
  }, [activeTab, profile.id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          media_assets:media_assets!inner(*)
        `)
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      // Apply filters based on active tab
      switch (activeTab) {
        case 'public':
          query = query.eq('visibility', 'public').eq('is_ppv', false);
          break;
        case 'premium':
          query = query.or('visibility.eq.subscribers_only,is_ppv.eq.true');
          break;
        case 'photos':
          query = query.eq('media_assets.media_type', 'image');
          break;
        case 'videos':
          query = query.eq('media_assets.media_type', 'video');
          break;
        case 'audio':
          query = query.eq('media_assets.media_type', 'audio');
          break;
        case 'liked':
          // This would require a different query structure
          if (session?.user?.id) {
            const { data: likedPosts } = await supabase
              .from('post_likes')
              .select(`
                post_id,
                posts:posts(
                  *,
                  media_assets:media_assets(*)
                )
              `)
              .eq('user_id', session.user.id);
            
            setPosts(likedPosts?.map(like => like.posts).filter(Boolean) || []);
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

      // Process posts to group media assets by post_id
      const processedPosts = data?.map(post => ({
        ...post,
        media_assets: data.filter(p => p.id === post.id)
          .map(p => p.media_assets)
          .flat()
          .filter(asset => asset.metadata?.post_id === post.id)
      })) || [];

      // Remove duplicates
      const uniquePosts = processedPosts.filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id)
      );

      setPosts(uniquePosts);
    } catch (error) {
      console.error('Error fetching content:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
        <div className="text-gray-400 text-lg">
          {activeTab === 'all' ? 'No posts yet' : `No ${activeTab} content available`}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PostCard post={post} isOwnProfile={isOwnProfile} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
