
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostCard } from "./PostCard";
import { motion } from "framer-motion";
import { Grid, List, Filter, Plus, Camera, Video, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  media_assets: Array<{
    id: string;
    url: string;
    media_type: string;
    thumbnail_url?: string;
  }>;
  creator?: {
    id: string;
    username?: string;
    avatar_url?: string;
  };
}

interface PostsFeedProps {
  profileId: string;
  isOwnProfile: boolean;
}

export const PostsFeed = ({ profileId, isOwnProfile }: PostsFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'media' | 'premium'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [profileId, filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          media_assets!left(id, url, media_type, thumbnail_url),
          creator:profiles!creator_id(id, username, avatar_url)
        `)
        .eq('creator_id', profileId)
        .order('created_at', { ascending: false });

      if (filter === 'media') {
        query = query.not('media_assets', 'is', null);
      } else if (filter === 'premium') {
        query = query.eq('is_ppv', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to load posts",
          variant: "destructive"
        });
        return;
      }

      // Group media assets by post
      const groupedPosts = data?.reduce((acc: Post[], post) => {
        const existingPost = acc.find(p => p.id === post.id);
        if (existingPost) {
          if (post.media_assets) {
            existingPost.media_assets.push(post.media_assets);
          }
        } else {
          acc.push({
            ...post,
            media_assets: post.media_assets ? [post.media_assets] : []
          });
        }
        return acc;
      }, []) || [];

      setPosts(groupedPosts);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="aspect-square bg-luxury-dark/30 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-2xl">
            {['all', 'media', 'premium'].map((f) => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  filter === f
                    ? 'bg-luxury-primary text-white shadow-lg'
                    : 'text-luxury-muted hover:text-luxury-neutral hover:bg-luxury-primary/10'
                }`}
              >
                {f === 'all' && 'All'}
                {f === 'media' && 'Media'}
                {f === 'premium' && 'Premium'}
              </motion.button>
            ))}
          </div>
          
          <div className="px-4 py-2 bg-luxury-dark/30 backdrop-blur-xl border border-luxury-accent/20 rounded-xl">
            <span className="text-luxury-accent text-sm font-medium">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-luxury-primary/20 text-luxury-primary' : 'text-luxury-muted hover:text-luxury-neutral'}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-luxury-primary/20 text-luxury-primary' : 'text-luxury-muted hover:text-luxury-neutral'}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {isOwnProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-button-gradient text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </motion.button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Camera className="w-12 h-12 text-luxury-muted" />
          </div>
          <h3 className="text-2xl font-bold text-luxury-neutral mb-3">
            {isOwnProfile ? "Share your first post" : "No posts yet"}
          </h3>
          <p className="text-luxury-muted mb-6 max-w-md mx-auto">
            {isOwnProfile 
              ? "Start sharing your content with your audience"
              : "This creator hasn't shared anything yet"
            }
          </p>
          {isOwnProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-button-gradient text-white px-8 py-3 rounded-xl font-medium shadow-button transition-all duration-300"
            >
              Create First Post
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
          }
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PostCard post={post} isOwnProfile={isOwnProfile} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
