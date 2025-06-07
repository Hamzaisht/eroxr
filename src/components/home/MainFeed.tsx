
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostCard } from '@/components/feed/PostCard';
import { LoadingSkeleton } from '@/components/feed/LoadingSkeleton';
import { EmptyFeed } from '@/components/feed/EmptyFeed';
import { StoryBar } from '@/components/stories/StoryBar';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  post_likes: { user_id: string }[];
  post_saves: { user_id: string }[];
  comments: { id: string }[];
};

export const MainFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id(username, avatar_url),
          post_likes(user_id),
          post_saves(user_id),
          comments(id)
        `)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + 9);

      if (error) throw error;
      return data || [];
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length * 10;
    },
    initialPageParam: 0,
  });

  const posts = data?.pages.flat() || [];

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Bar */}
      <StoryBar />
      
      {/* Main Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
        
        {hasNextPage && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
