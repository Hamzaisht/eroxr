
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Video, Music, Heart, MessageCircle, Share, Calendar, Play } from "lucide-react";
import { format } from "date-fns";

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  alt_text?: string;
  original_name?: string;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  share_count: number;
  media_assets?: MediaAsset[];
  tags: string[];
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
      
      // First get posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          share_count,
          tags
        `)
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Then get media assets for each post
      const postsWithMedia = await Promise.all(
        postsData.map(async (post) => {
          const { data: mediaAssets, error: mediaError } = await supabase
            .from('media_assets')
            .select('*')
            .eq('metadata->>post_id', post.id);

          if (mediaError) {
            console.error('Error fetching media for post:', post.id, mediaError);
          }

          // Filter by media type based on active tab
          let filteredAssets = mediaAssets || [];
          if (activeTab === 'photos') {
            filteredAssets = filteredAssets.filter(asset => asset.media_type === 'image');
          } else if (activeTab === 'videos') {
            filteredAssets = filteredAssets.filter(asset => asset.media_type === 'video');
          } else if (activeTab === 'audio') {
            filteredAssets = filteredAssets.filter(asset => asset.media_type === 'audio');
          }

          return {
            ...post,
            media_assets: filteredAssets
          };
        })
      );

      // Filter out posts that don't match the current tab
      let finalPosts = postsWithMedia;
      if (activeTab !== 'posts') {
        finalPosts = postsWithMedia.filter(post => 
          post.media_assets && post.media_assets.length > 0
        );
      }

      setPosts(finalPosts);
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

  const getMediaUrl = (storagePath: string) => {
    if (!storagePath) return '';
    
    // Check if it's already a full URL
    if (storagePath.startsWith('http')) {
      return storagePath;
    }
    
    // Get public URL from Supabase storage
    const { data } = supabase.storage
      .from('media-assets')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  };

  const getMediaPreview = (post: Post) => {
    if (!post.media_assets || post.media_assets.length === 0) {
      return null;
    }

    const firstMedia = post.media_assets[0];
    const mediaUrl = getMediaUrl(firstMedia.storage_path);
    
    if (!mediaUrl) return null;

    // Check media type
    if (firstMedia.media_type === 'image') {
      return (
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3">
          <img 
            src={mediaUrl} 
            alt={firstMedia.alt_text || "Post media"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', mediaUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
          {post.media_assets.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              +{post.media_assets.length - 1}
            </div>
          )}
        </div>
      );
    }
    
    if (firstMedia.media_type === 'video') {
      return (
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3">
          <video 
            src={mediaUrl}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            onError={(e) => {
              console.error('Video failed to load:', mediaUrl);
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Play className="w-8 h-8 text-white" />
          </div>
          {post.media_assets.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              +{post.media_assets.length - 1}
            </div>
          )}
        </div>
      );
    }

    if (firstMedia.media_type === 'audio') {
      return (
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3 bg-gradient-to-br from-purple-900/60 to-pink-900/60 flex items-center justify-center">
          <div className="text-center">
            <Music className="w-12 h-12 text-white mb-2 mx-auto" />
            <p className="text-white text-sm">Audio Content</p>
          </div>
          {post.media_assets.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              +{post.media_assets.length - 1}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="w-full px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-white/10 rounded-lg mb-3"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No posts yet</h3>
            <p className="text-white/60 text-lg">
              {isOwnProfile 
                ? "Start sharing your content to build your profile!" 
                : `@${profile.username} hasn't posted anything yet.`
              }
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
            >
              {/* Media Preview */}
              {getMediaPreview(post)}
              
              {/* Content */}
              <div className="space-y-3">
                <p className="text-white text-sm leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, i) => (
                      <span 
                        key={i}
                        className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-white/50">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{post.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{post.comments_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="w-4 h-4" />
                      <span className="text-xs">{post.share_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {format(new Date(post.created_at), 'MMM d')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
