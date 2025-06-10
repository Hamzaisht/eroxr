
import React from 'react';
import { PostCard } from '@/components/feed/PostCard';
import { LoadingSkeleton } from '@/components/feed/LoadingSkeleton';
import { EmptyFeed } from '@/components/feed/EmptyFeed';
import { StoryBar } from '@/components/stories/StoryBar';
import { useHomePosts } from '@/hooks/useHomePosts';
import { usePostActions } from '@/hooks/usePostActions';

export const MainFeed = () => {
  const { data: posts, isLoading, error, refetch } = useHomePosts();
  const { handleLike, handleDelete } = usePostActions();

  const handleLikePost = async (postId: string) => {
    console.log('MainFeed - Like post:', postId);
    await handleLike(postId);
  };

  const handleDeletePost = async (postId: string, creatorId: string) => {
    console.log('MainFeed - Delete post:', postId, 'by creator:', creatorId);
    await handleDelete(postId);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Bar */}
      <StoryBar />
      
      {/* Main Feed */}
      <div className="space-y-6">
        {posts && posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts?.map((post: any) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLikePost}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};
