
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Eye,
  Zap,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MediaRenderer } from '@/components/media/MediaRenderer';
import { formatDistanceToNow } from 'date-fns';

interface Creator {
  id: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
}

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
  original_name: string;
  alt_text?: string;
}

interface Post {
  id: string;
  content: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  view_count?: number;
  share_count?: number;
  engagement_score?: number;
  is_ppv?: boolean;
  ppv_amount?: number;
  visibility: string;
  creator: Creator;
  media_assets?: MediaAsset[];
  isLiked?: boolean;
  isSaved?: boolean;
}

interface EnhancedPostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onDelete: (postId: string, creatorId: string) => void;
}

export const EnhancedPostCard = ({ 
  post, 
  currentUserId, 
  onLike, 
  onDelete 
}: EnhancedPostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  console.log(`EnhancedPostCard - Rendering post ${post.id} with media:`, {
    hasMediaAssets: !!post.media_assets,
    mediaCount: post.media_assets?.length || 0,
    hasValidMedia: post.media_assets && post.media_assets.length > 0,
    validAssets: post.media_assets?.filter(asset => asset && asset.storage_path).length || 0,
    isLiked: post.isLiked,
    likesCount: post.likes_count
  });

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  }, [isLiked, onLike, post.id]);

  const handleSave = useCallback(() => {
    setIsSaved(!isSaved);
  }, [isSaved]);

  const canDelete = currentUserId === post.creator_id;

  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const validMediaAssets = post.media_assets?.filter(asset => 
    asset && asset.storage_path && asset.media_type
  ) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl border border-luxury-primary/20 rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 hover:scale-[1.02] group"
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-12 w-12 ring-2 ring-luxury-primary/30 hover:ring-luxury-primary/60 transition-all duration-300">
                <AvatarImage 
                  src={post.creator.avatar_url || undefined} 
                  alt={post.creator.username || 'Creator'} 
                />
                <AvatarFallback className="bg-luxury-primary/20 text-luxury-primary font-semibold">
                  {(post.creator.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-luxury-neutral truncate hover:text-luxury-primary transition-colors duration-300 cursor-pointer">
                  {post.creator.username || 'Anonymous'}
                </h3>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="h-4 w-4 text-luxury-accent" />
                </motion.div>
              </div>
              <p className="text-sm text-luxury-muted">
                {formatTimeAgo(post.created_at)}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-luxury-primary/10 rounded-full transition-colors duration-300"
          >
            <MoreVertical className="h-5 w-5 text-luxury-muted hover:text-luxury-neutral" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <p className="text-luxury-neutral leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Media Content */}
        {validMediaAssets.length > 0 && (
          <div className="mb-4">
            <MediaRenderer 
              assets={validMediaAssets}
              className="w-full max-h-96"
            />
          </div>
        )}

        {/* PPV Badge */}
        {post.is_ppv && post.ppv_amount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-accent/20 border border-luxury-accent/30 rounded-full text-luxury-accent text-sm font-medium mb-4"
          >
            <Star className="h-3 w-3" />
            Premium Content - ${post.ppv_amount}
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-300 ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-luxury-muted hover:text-red-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-luxury-muted hover:text-luxury-primary transition-colors duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments_count || 0}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-luxury-muted hover:text-luxury-accent transition-colors duration-300"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">{post.share_count || 0}</span>
            </motion.button>

            {post.view_count && (
              <div className="flex items-center space-x-2 text-luxury-muted">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{post.view_count}</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className={`transition-all duration-300 ${
              isSaved 
                ? 'text-luxury-accent' 
                : 'text-luxury-muted hover:text-luxury-accent'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
