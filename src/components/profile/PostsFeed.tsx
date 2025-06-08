import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostCard } from "./PostCard";
import { motion } from "framer-motion";
import { Grid, List, Filter, Plus, Camera, Video, Image, Play, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  post_media_actions: Array<{
    id: string;
    media_url: string;
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
  const navigate = useNavigate();

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
          post_media_actions!left(id, media_url, media_type, thumbnail_url),
          creator:profiles!creator_id(id, username, avatar_url)
        `)
        .eq('creator_id', profileId)
        .order('created_at', { ascending: false });

      if (filter === 'media') {
        query = query.not('post_media_actions', 'is', null);
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

      // Group media by post
      const groupedPosts = data?.reduce((acc: Post[], post) => {
        const existingPost = acc.find(p => p.id === post.id);
        if (existingPost) {
          if (post.post_media_actions) {
            existingPost.post_media_actions.push(post.post_media_actions);
          }
        } else {
          acc.push({
            ...post,
            post_media_actions: post.post_media_actions ? [post.post_media_actions] : []
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

  const handleCreatePost = () => {
    if (isOwnProfile) {
      navigate('/create-post');
      toast({
        title: "Create Post",
        description: "Opening post creation...",
      });
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'media' | 'premium') => {
    setFilter(newFilter);
    toast({
      title: "Filter Applied",
      description: `Showing ${newFilter === 'all' ? 'all posts' : newFilter === 'media' ? 'media posts' : 'premium posts'}`,
    });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    toast({
      title: "View Changed",
      description: `Switched to ${mode} view`,
    });
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleLikePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('post_likes')
        .upsert({ post_id: postId, user_id: profileId });

      if (error) throw error;

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      ));

      toast({
        title: "Liked!",
        description: "Post liked successfully",
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive"
      });
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
      {/* Controls with enhanced animations */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-2xl">
            {(['all', 'media', 'premium'] as const).map((f, index) => (
              <motion.button
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(f)}
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
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-luxury-dark/30 backdrop-blur-xl border border-luxury-accent/20 rounded-xl"
          >
            <span className="text-luxury-accent text-sm font-medium">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-xl">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 transition-all duration-300 ${viewMode === 'grid' ? 'bg-luxury-primary/20 text-luxury-primary' : 'text-luxury-muted hover:text-luxury-neutral'}`}
            >
              <Grid className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleViewModeChange('list')}
              className={`p-2 transition-all duration-300 ${viewMode === 'list' ? 'bg-luxury-primary/20 text-luxury-primary' : 'text-luxury-muted hover:text-luxury-neutral'}`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>

          {isOwnProfile && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              className="flex items-center gap-2 px-4 py-2 bg-button-gradient text-white rounded-xl font-medium shadow-button hover:shadow-button-hover transition-all duration-300 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
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
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <Camera className="w-12 h-12 text-luxury-muted" />
          </motion.div>
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
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              className="bg-button-gradient text-white px-8 py-3 rounded-xl font-medium shadow-button transition-all duration-300 group"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Create First Post
              </span>
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
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 hover:border-luxury-primary/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-luxury">
                {/* Media Preview */}
                {post.post_media_actions && post.post_media_actions.length > 0 && (
                  <div className="relative aspect-video overflow-hidden">
                    {post.post_media_actions[0].media_type?.startsWith('video') ? (
                      <div className="relative w-full h-full">
                        <video
                          src={post.post_media_actions[0].media_url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/30 flex items-center justify-center"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-16 h-16 bg-luxury-primary/80 backdrop-blur-xl rounded-full flex items-center justify-center"
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </motion.div>
                        </motion.div>
                      </div>
                    ) : (
                      <img
                        src={post.post_media_actions[0].media_url}
                        alt="Post media"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    
                    {/* PPV Badge */}
                    {post.is_ppv && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-3 px-3 py-1 bg-luxury-accent/90 backdrop-blur-xl rounded-full text-white text-sm font-medium"
                      >
                        ${post.ppv_amount}
                      </motion.div>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  <p className="text-luxury-neutral text-sm mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  {/* Stats with hover animations */}
                  <div className="flex items-center justify-between text-luxury-muted text-sm">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePost(post.id);
                        }}
                        className="flex items-center gap-1 hover:text-red-400 transition-colors duration-300 group"
                      >
                        <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        {post.likes_count}
                      </motion.button>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1 hover:text-blue-400 transition-colors duration-300"
                      >
                        <Eye className="w-4 h-4" />
                        {post.view_count}
                      </motion.span>
                    </div>
                    <span className="text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
