
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GlassmorphismCard } from "./effects/GlassmorphismCard";
import { Heart, MessageCircle, Share, Bookmark, Play, Image as ImageIcon } from "lucide-react";

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  share_count: number;
  metadata?: any;
}

interface ProfileContentProps {
  profile: any;
  activeTab: string;
  isOwnProfile: boolean;
}

export const ProfileContent = ({ profile, activeTab, isOwnProfile }: ProfileContentProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [profile.id, activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      // Filter by tab if needed
      if (activeTab === 'photos') {
        query = query.contains('metadata', { type: 'image' });
      } else if (activeTab === 'videos') {
        query = query.contains('metadata', { type: 'video' });
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassmorphismCard key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </GlassmorphismCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <GlassmorphismCard className="p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 text-lg">
                {isOwnProfile 
                  ? "Start sharing your content to build your profile!" 
                  : `@${profile.username} hasn't posted anything yet.`
                }
              </p>
            </motion.div>
          </GlassmorphismCard>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphismCard className="p-0 overflow-hidden group hover:scale-105 transition-transform duration-300">
                {/* Media Preview */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                  {post.metadata?.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/70" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/70" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-white text-sm mb-3 line-clamp-3">{post.content}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-gray-400 text-xs">
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
                        <Share className="w-4 h-4" />
                        <span>{post.share_count || 0}</span>
                      </div>
                    </div>
                    <div className="text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
