
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share, Bookmark, Eye, Lock, Play, Volume2, VolumeX, MoreHorizontal } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaWatermark } from "@/components/media/MediaWatermark";
import { format, formatDistanceToNow } from "date-fns";
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
  media_assets: any[];
}

interface PostCardProps {
  post: Post;
  isOwnProfile: boolean;
}

export const PostCard = ({ post, isOwnProfile }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullContent, setShowFullContent] = useState(false);

  const isPremium = post.is_ppv || post.visibility === 'subscribers_only';
  const hasMedia = post.media_assets && post.media_assets.length > 0;
  const firstMedia = hasMedia ? post.media_assets[0] : null;
  
  const isVideo = firstMedia?.media_type === 'video' || firstMedia?.url?.includes('.mp4');
  const isAudio = firstMedia?.media_type === 'audio' || firstMedia?.url?.includes('.mp3');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
    >
      {/* Media Container */}
      {hasMedia && (
        <div className="relative aspect-square overflow-hidden">
          {/* Premium Overlay */}
          {isPremium && !isOwnProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-white font-semibold mb-2">Premium Content</h3>
                <p className="text-gray-300 text-sm mb-4">
                  {post.is_ppv ? `$${post.ppv_amount} to unlock` : 'Subscribe to view'}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400">
                  {post.is_ppv ? 'Purchase' : 'Subscribe'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Media Content */}
          <div className="relative w-full h-full">
            {isVideo ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  className="w-full h-full object-cover"
                  poster={firstMedia?.thumbnail_url}
                  muted={isMuted}
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Video Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.button>
                </div>
                
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>
              </div>
            ) : isAudio ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                  >
                    <Volume2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <p className="text-white font-medium">Audio Content</p>
                </div>
              </div>
            ) : (
              <UniversalMedia
                src={firstMedia?.url}
                type="image"
                alt={post.content}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Watermark */}
            <MediaWatermark 
              creatorHandle={post.creator?.username}
              className="bottom-2 right-2"
            />
            
            {/* Media Count Indicator */}
            {post.media_assets.length > 1 && (
              <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                <span className="text-white text-xs font-medium">
                  1/{post.media_assets.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Post Content */}
        {post.content && (
          <div>
            <p className={`text-gray-300 leading-relaxed ${!showFullContent && post.content.length > 150 ? 'line-clamp-3' : ''}`}>
              {post.content}
            </p>
            {post.content.length > 150 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-cyan-400 text-sm mt-1 hover:text-cyan-300 transition-colors"
              >
                {showFullContent ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes_count.toLocaleString()}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments_count.toLocaleString()}</span>
            </motion.button>

            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">{post.view_count.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Share className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border border-white/20">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">
              {post.is_ppv ? 'PPV' : 'Premium'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
