
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share, Bookmark, Eye, Lock, Play, Volume2, VolumeX, MoreHorizontal, Download, Camera } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaWatermark } from "@/components/media/MediaWatermark";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { CommentDialog } from "@/components/comments/CommentDialog";

interface Creator {
  id: string;
  username?: string;
  avatar_url?: string;
}

interface MediaAsset {
  id: string;
  url: string;
  media_type: string;
  thumbnail_url?: string;
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
  media_assets: MediaAsset[];
  creator?: Creator;
}

interface PostCardProps {
  post: Post;
  isOwnProfile: boolean;
}

export const PostCard = ({ post, isOwnProfile }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isPremium = post.is_ppv || post.visibility === 'subscribers_only';
  const hasMedia = post.media_assets && post.media_assets.length > 0;
  const firstMedia = hasMedia ? post.media_assets[0] : null;
  
  const isVideo = firstMedia?.media_type === 'video' || firstMedia?.url?.includes('.mp4');
  const isAudio = firstMedia?.media_type === 'audio' || firstMedia?.url?.includes('.mp3');

  const handlePurchase = () => {
    // TODO: Implement PPV purchase
    console.log('Purchase PPV content');
  };

  const handleSubscribe = () => {
    // TODO: Implement subscription
    console.log('Subscribe to creator');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/20"
    >
      {/* Media Container */}
      {hasMedia && (
        <div className="relative aspect-square overflow-hidden">
          {/* Premium Overlay */}
          {isPremium && !isOwnProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex items-center justify-center"
            >
              <div className="text-center p-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
                >
                  <Lock className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-white font-bold text-xl mb-3">Premium Content</h3>
                <p className="text-gray-300 text-sm mb-6">
                  {post.is_ppv ? `$${post.ppv_amount} to unlock` : 'Subscribe to view'}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={post.is_ppv ? handlePurchase : handleSubscribe}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold shadow-lg"
                  >
                    {post.is_ppv ? `Purchase for $${post.ppv_amount}` : 'Subscribe Now'}
                  </Button>
                  {post.is_ppv && (
                    <Button 
                      onClick={handleSubscribe}
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10 rounded-xl"
                    >
                      Subscribe for All Content
                    </Button>
                  )}
                </div>
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
                  onLoadedData={() => setImageLoaded(true)}
                />
                
                {/* Video Controls */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 hover:border-white/60 transition-all duration-300"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.button>
                </div>
                
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                </button>
              </div>
            ) : isAudio ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-pink-900/60 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
                  >
                    <Volume2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <p className="text-white font-bold text-lg">Audio Content</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={firstMedia?.url}
                  alt={post.content}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </div>
            )}
            
            {/* Watermark */}
            {post.creator?.username && (
              <MediaWatermark 
                creatorHandle={post.creator.username}
                className="bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20"
              />
            )}
            
            {/* Media Count Indicator */}
            {post.media_assets.length > 1 && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/30">
                <span className="text-white text-sm font-bold">
                  1/{post.media_assets.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Post Content */}
        {post.content && (
          <div>
            <p className={`text-gray-300 leading-relaxed ${!showFullContent && post.content.length > 150 ? 'line-clamp-3' : ''}`}>
              {post.content}
            </p>
            {post.content.length > 150 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-cyan-400 text-sm mt-2 hover:text-cyan-300 transition-colors font-medium"
              >
                {showFullContent ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-bold">{post.comments_count.toLocaleString()}</span>
            </motion.button>

          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-yellow-500 bg-yellow-500/20' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/20'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
            >
              <Share className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
          <span className="font-medium">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          <span className="font-medium">{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border border-white/30 shadow-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-bold">
              {post.is_ppv ? 'PPV' : 'Premium'}
            </span>
          </div>
        </div>
      )}
      
      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        postId={post.id}
        postContent={post.content}
      />
    </motion.div>
  );
};
