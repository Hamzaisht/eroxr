
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { PostCard } from "@/components/feed/PostCard";
import { SuggestedCreators } from "@/components/home/SuggestedCreators";
import { Loader2 } from "lucide-react";
import type { Post } from "@/components/feed/types";

const Home = () => {
  const session = useSession();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log("Home - Fetching posts...");
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_url,
          video_urls,
          creator_id,
          created_at,
          updated_at,
          likes_count,
          comments_count,
          visibility,
          tags,
          ppv_amount,
          is_ppv,
          screenshots_count,
          downloads_count,
          creator:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Home - Error fetching posts:", error);
        throw new Error(error.message || "Failed to fetch posts");
      }

      console.log("Home - Posts fetched:", data?.length || 0);
      
      // Transform the data to match our Post interface
      const postsWithLikes: Post[] = (data || []).map(post => ({
        id: post.id,
        content: post.content || '',
        media_url: post.media_url,
        video_urls: post.video_urls,
        creator_id: post.creator_id,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        visibility: post.visibility || 'public',
        tags: post.tags,
        ppv_amount: post.ppv_amount,
        is_ppv: post.is_ppv || false,
        screenshots_count: post.screenshots_count || 0,
        downloads_count: post.downloads_count || 0,
        has_liked: false, // We'll implement this properly later
        creator: Array.isArray(post.creator) && post.creator.length > 0 
          ? {
              id: post.creator[0].id || '',
              username: post.creator[0].username || 'Unknown',
              avatar_url: post.creator[0].avatar_url || ''
            }
          : {
              id: '',
              username: 'Unknown',
              avatar_url: ''
            }
      }));

      return postsWithLikes;
    },
    enabled: !!session
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading posts</p>
          <p className="text-gray-400 text-sm">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Suggested Creators */}
        <SuggestedCreators />
        
        {/* Posts Feed */}
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={session?.user?.id}
                onLike={async (postId) => {
                  console.log("Home - Like post:", postId);
                  // Implement like functionality
                }}
                onDelete={async (postId, creatorId) => {
                  console.log("Home - Delete post:", postId);
                  // Implement delete functionality
                }}
                onComment={() => {
                  console.log("Home - Comment on post");
                  // Implement comment functionality
                }}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No posts found</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to create a post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
