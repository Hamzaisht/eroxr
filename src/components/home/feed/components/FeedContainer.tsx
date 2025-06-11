
import { EnhancedPostCard } from '@/components/feed/EnhancedPostCard';

interface FeedContainerProps {
  posts: any[];
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const FeedContainer = ({ posts, onLike, onDelete, currentUserId }: FeedContainerProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <EnhancedPostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};
