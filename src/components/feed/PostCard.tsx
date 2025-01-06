import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "./types";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { PPVContent } from "./PPVContent";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  const isOwner = currentUserId === post.creator_id;

  return (
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

            {/* Media Grid - Now handles both images and videos */}
            {(post.media_url?.length > 0 || post.video_urls?.length > 0) && (
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {post.media_url?.map((url, index) => (
                  <img
                    key={`img-${index}`}
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
                {post.video_urls?.map((url, index) => (
                  <video
                    key={`video-${index}`}
                    src={url}
                    controls
                    className="rounded-lg w-full h-48 object-cover"
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
  );
};