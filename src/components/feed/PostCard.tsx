import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "./types";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { PPVContent } from "./PPVContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  const isOwner = currentUserId === post.creator_id;
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  return (
    <>
      <Card key={post.id} className="overflow-hidden">
        <CardHeader>
          <PostHeader 
            post={post} 
            isOwner={isOwner} 
            onDelete={onDelete}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {post.is_ppv && !post.has_purchased && !isOwner ? (
            <PPVContent postId={post.id} amount={post.ppv_amount || 0} />
          ) : (
            <>
              <p className="whitespace-pre-wrap">{post.content}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Media Grid - Now handles both images and videos with high quality */}
              {(post.media_url?.length > 0 || post.video_urls?.length > 0) && (
                <div className="grid gap-0.5 grid-cols-1 sm:grid-cols-2">
                  {post.media_url?.map((url, index) => (
                    <div 
                      key={`img-${index}`}
                      className="cursor-pointer overflow-hidden"
                      onClick={() => setSelectedMedia(url)}
                    >
                      <img
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        style={{ minHeight: "720px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                  {post.video_urls?.map((url, index) => (
                    <video
                      key={`video-${index}`}
                      src={url}
                      controls
                      className="w-full h-full object-cover"
                      style={{ minHeight: "720px" }}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              )}
              
              {post.visibility === 'subscribers_only' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Subscribers Only
                </Badge>
              )}

              {post.is_ppv && (
                <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                  Premium Content
                </Badge>
              )}

              <PostActions
                postId={post.id}
                likesCount={post.likes_count}
                commentsCount={post.comments_count}
                hasLiked={post.has_liked}
                onLike={onLike}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Full-screen media viewer */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
          <AnimatePresence>
            {selectedMedia && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img
                  src={selectedMedia}
                  alt="Enlarged media"
                  className="max-w-full max-h-[95vh] object-contain"
                  style={{ imageRendering: "high-quality" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};