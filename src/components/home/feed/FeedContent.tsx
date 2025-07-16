
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { useSession } from "@supabase/auth-helpers-react";
import { usePostActions } from "@/hooks/usePostActions";
import { useHomePosts } from "@/hooks/useHomePosts";
import { Button } from "@/components/ui/button";
import { FreemiumPostCard } from "@/components/subscription/FreemiumPostCard";

interface FeedContentProps {
  isFreemium?: boolean;
}

export const FeedContent = ({ isFreemium = false }: FeedContentProps) => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { data: posts, isLoading, error, refetch } = useHomePosts();
  
  // Removed console logging to prevent re-render issues

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-gold" />
        <p className="text-luxury-neutral">Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Unable to load feed</h3>
          <p className="text-luxury-neutral mb-4">
            {error instanceof Error ? error.message : "Something went wrong while loading posts"}
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
        <div className="bg-luxury-darker/50 rounded-full p-6">
          <Plus className="h-12 w-12 text-luxury-gold" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Welcome to Olympus!</h3>
          <p className="text-luxury-neutral max-w-md">
            No posts yet. Be the first to share something amazing with the community!
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline"
          size="sm"
          className="border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark"
        >
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post: any) => {
        // Show teaser cards for freemium users
        if (isFreemium) {
          return (
            <FreemiumPostCard
              key={post.id}
              creator={{
                username: post.creator?.username || 'Anonymous',
                avatar_url: post.creator?.avatar_url
              }}
              preview={{
                content: post.content || 'Exclusive content awaits...',
                timestamp: new Date(post.created_at).toLocaleDateString(),
                hasMedia: (post.media_assets?.length > 0) || (post.video_urls?.length > 0),
                mediaCount: (post.media_assets?.length || 0) + (post.video_urls?.length || 0)
              }}
              engagement={{
                likes: post.likes_count || Math.floor(Math.random() * 50) + 10,
                comments: post.comments_count || Math.floor(Math.random() * 20) + 5,
                shares: post.share_count || Math.floor(Math.random() * 15) + 2
              }}
            />
          );
        }
        
        return (
          <EnhancedPostCard
            key={post.id}
            post={post}
            currentUserId={session?.user?.id}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        );
      })}
      
      {/* Load more indicator - for future implementation */}
      <div className="flex justify-center py-8">
        <p className="text-luxury-neutral text-sm">You've reached the end of your feed</p>
      </div>
    </div>
  );
};
