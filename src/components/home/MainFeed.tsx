
import React from 'react';
import { Post } from '@/components/feed/Post';
import { LoadingSkeleton } from '@/components/feed/LoadingSkeleton';
import { EmptyFeed } from '@/components/feed/EmptyFeed';
import { StoryBar } from '@/components/stories/StoryBar';
import { useHomePosts } from '@/hooks/useHomePosts';
import { usePostActions } from '@/hooks/usePostActions';
import { useAuth } from '@/contexts/AuthContext';

export const MainFeed = () => {
  const { data: posts, isLoading, error, refetch } = useHomePosts();
  const { handleLike, handleDelete } = usePostActions();
  const { user } = useAuth();

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
          posts?.map((post: any) => {
            // Transform the post data to match what Post component expects
            const transformedPost = {
              id: post.id,
              content: post.content,
              creator: {
                id: post.creator.id,
                username: post.creator.username || 'Unknown',
                avatar_url: post.creator.avatar_url,
                isVerified: post.creator.is_verified || false,
              },
              createdAt: post.created_at, // Post component expects createdAt
              likesCount: post.likes_count || 0,
              commentsCount: post.comments_count || 0,
              isLiked: false, // Could be enhanced with actual like status
              isSaved: false, // Could be enhanced with actual save status
              media_assets: post.media_assets || [], // Pass through media assets
            };

            console.log('MainFeed - Rendering post with media:', {
              postId: post.id,
              hasMediaAssets: !!post.media_assets,
              mediaCount: post.media_assets?.length || 0,
              transformedPost
            });

            return (
              <Post 
                key={post.id} 
                post={transformedPost}
                currentUser={user ? { id: user.id, username: user.user_metadata?.username || 'User' } : undefined}
                onLike={handleLikePost}
                onDelete={handleDeletePost}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
