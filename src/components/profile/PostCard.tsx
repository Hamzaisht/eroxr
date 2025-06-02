
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Eye, MessageCircle, Play, Volume2 } from "lucide-react";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
  const [isHovered, setIsHovered] = useState(false);
  
  const isLocked = (post.is_ppv || post.visibility === 'subscribers_only') && !isOwnProfile;
  const primaryAsset = post.media_assets?.[0];
  
  const getMediaIcon = () => {
    if (!primaryAsset) return null;
    
    switch (primaryAsset.media_type) {
      case 'video':
        return <Play className="w-6 h-6" />;
      case 'audio':
        return <Volume2 className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <Card className="overflow-hidden bg-gray-900/50 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
        {/* Media Container */}
        <div className="relative aspect-square">
          {primaryAsset && !isLocked ? (
            <MediaRenderer 
              media={primaryAsset}
              className="w-full h-full object-cover"
              autoPlay={false}
              controls={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {isLocked ? (
                <Lock className="w-12 h-12 text-gray-600" />
              ) : (
                <div className="text-gray-600 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                  <span className="text-sm">Text Post</span>
                </div>
              )}
            </div>
          )}

          {/* Media Type Indicator */}
          {primaryAsset && (
            <div className="absolute top-2 right-2">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 text-white">
                {getMediaIcon()}
              </div>
            </div>
          )}

          {/* Multiple Media Indicator */}
          {post.media_assets?.length > 1 && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/60 text-white border-none">
                +{post.media_assets.length - 1}
              </Badge>
            </div>
          )}

          {/* Premium/PPV Badge */}
          {post.is_ppv && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                ${post.ppv_amount}
              </Badge>
            </div>
          )}

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-white text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count}</span>
                </div>
              </div>
              {post.content && (
                <div className="text-xs text-gray-300 max-w-xs truncate">
                  {post.content}
                </div>
              )}
              <div className="text-xs text-gray-400">
                {format(new Date(post.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
