import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "./types";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { PPVContent } from "./PPVContent";
import { motion } from "framer-motion";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  const isOwner = currentUserId === post.creator_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-luxury-dark/90 to-luxury-dark/70 backdrop-blur-lg border-luxury-neutral/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-luxury-neutral whitespace-pre-wrap">{post.content}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className="bg-luxury-primary/20 text-luxury-primary hover:bg-luxury-primary/30"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.media_url && post.media_url.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4">
                  {post.media_url.map((url, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              
              {post.visibility === 'subscribers_only' && (
                <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary mt-4">
                  Subscribers Only
                </Badge>
              )}

              {post.is_ppv && (
                <Badge variant="secondary" className="bg-luxury-accent/10 text-luxury-accent mt-4">
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
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};