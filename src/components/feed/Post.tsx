
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, MoreVertical, Trash2 } from "lucide-react";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
  original_name: string;
  alt_text?: string;
}

interface PostProps {
  post: {
    id: string;
    content: string;
    creator: {
      id: string;
      username: string;
      avatar_url?: string | null;
      isVerified?: boolean;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    isSaved?: boolean;
    media_assets?: MediaAsset[];
  };
  currentUser?: {
    id: string;
    username: string;
  };
  onLike?: (postId: string) => void;
  onDelete?: (postId: string, creatorId: string) => void;
}

export const Post = ({ post, currentUser, onLike, onDelete }: PostProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved!",
      description: isSaved ? "Post removed from your saved items" : "Post saved to your collection",
    });
  };

  const handleDelete = async () => {
    if (!currentUser || currentUser.id !== post.creator.id) return;
    
    setIsDeleting(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      onDelete?.(post.id, post.creator.id);
    }, 500);
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment posted!",
      description: "Your comment has been added to the post",
    });
    setNewComment("");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  // Check for valid media assets
  const hasValidMedia = post.media_assets && post.media_assets.length > 0 && 
    post.media_assets.some(asset => asset && asset.storage_path && asset.id && asset.media_type);

  console.log("Post component - Rendering post:", {
    postId: post.id,
    hasMediaAssets: !!post.media_assets,
    mediaCount: post.media_assets?.length || 0,
    hasValidMedia,
    mediaAssets: post.media_assets
  });

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: -50,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          layout
        >
          <Card className="bg-luxury-darker border-luxury-neutral/10 overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {post.creator.avatar_url ? (
                      <AvatarImage src={post.creator.avatar_url} alt={post.creator.username} />
                    ) : null}
                    <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
                      {getInitials(post.creator.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">{post.creator.username}</p>
                    <p className="text-gray-400 text-sm">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentUser?.id === post.creator.id && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {post.content && (
                <div className="px-4 pb-3">
                  <p className="text-white whitespace-pre-wrap">{post.content}</p>
                </div>
              )}

              {/* Media Rendering */}
              {hasValidMedia && (
                <div className="relative">
                  <MediaRenderer
                    assets={post.media_assets!}
                    className="w-full"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likesCount}</span>
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-gray-400"
                        onClick={() => setShowComments(!showComments)}
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.commentsCount}</span>
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${isSaved ? 'text-blue-400' : 'text-gray-400'}`}
                      onClick={handleSave}
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                    </Button>
                  </motion.div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-700 pt-4 space-y-4">
                        {/* Comment Input */}
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-luxury-darker text-luxury-neutral text-xs">
                              {currentUser ? getInitials(currentUser.username) : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
                              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                            />
                            {newComment.trim() && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-end"
                              >
                                <Button size="sm" onClick={handleComment} className="text-xs">
                                  Post Comment
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
