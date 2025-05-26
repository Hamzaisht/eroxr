
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { PostCard } from "@/components/feed/PostCard";
import { SuggestedCreators } from "@/components/home/SuggestedCreators";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  content: string;
  media_url: string[] | null;
  video_urls: string[] | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  has_liked: boolean;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

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
          creator:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Home - Error fetching posts:", error);
        throw error;
      }

      console.log("Home - Posts fetched:", data?.length || 0);
      
      // Add has_liked field (simplified - you can enhance this with actual like status)
      const postsWithLikes = data?.map(post => ({
        ...post,
        has_liked: false
      })) || [];

      return postsWithLikes as Post[];
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading posts</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
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
