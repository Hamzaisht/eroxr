import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { RightSidebar } from "@/components/home/RightSidebar";
import { StoryReel } from "@/components/StoryReel";
import { LiveStreams } from "@/components/home/LiveStreams";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostActions } from "@/hooks/usePostActions";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

const Home = () => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { isOpen: isCreatePostOpen, openDialog: openCreatePost, closeDialog: closeCreatePost } = useCreatePostDialog();
  const { openDialog: openGoLive } = useGoLiveDialog();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['home-posts'],
    queryFn: async () => {
      console.log("Home - Fetching posts with profiles and media...");
      
      try {
        // Fetch posts with creator profiles
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            creator_id,
            created_at,
            updated_at,
            likes_count,
            comments_count,
            visibility,
            view_count,
            share_count,
            engagement_score,
            is_ppv,
            ppv_amount,
            creator:profiles!posts_creator_id_fkey(
              id, 
              username,
              bio,
              location
            )
          `)
          .eq('visibility', 'public')
          .order('created_at', { ascending: false })
          .limit(20);

        if (postsError) {
          console.error("Home - Error fetching posts:", postsError);
          throw new Error(postsError.message || "Failed to fetch posts");
        }

        console.log("Home - Posts fetched successfully:", postsData?.length || 0);
        
        if (!postsData || postsData.length === 0) {
          console.log("Home - No posts found");
          return [];
        }
        
        // For each post, fetch associated media assets and creator avatars
        const postsWithMedia = await Promise.all(
          postsData.map(async (post) => {
            try {
              // Query media assets for this post - using correct JSONB filtering
              const { data: mediaAssets, error: mediaError } = await supabase
                .from('media_assets')
                .select('*')
                .filter('metadata->>post_id', 'eq', post.id);

              if (mediaError) {
                console.error("Error fetching media for post:", post.id, mediaError);
              }

              console.log(`Media assets for post ${post.id}:`, mediaAssets);

              // Fetch creator avatar from media_assets
              let creatorAvatarUrl = null;
              if (post.creator_id) {
                const { data: avatarData } = await supabase
                  .from('media_assets')
                  .select('storage_path')
                  .eq('user_id', post.creator_id)
                  .eq('media_type', 'image')
                  .eq('metadata->>usage', 'avatar')
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .maybeSingle();

                if (avatarData) {
                  const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(avatarData.storage_path);
                  creatorAvatarUrl = publicUrl;
                }
              }

              // Transform media assets to include full URL with proper Supabase URL
              const transformedMedia = (mediaAssets || []).map(asset => ({
                id: asset.id,
                url: supabase.storage.from('media').getPublicUrl(asset.storage_path).data.publicUrl,
                type: asset.media_type as 'image' | 'video' | 'audio',
                alt_text: asset.alt_text || `Media for ${post.content?.substring(0, 50) || 'post'}`
              }));

              // Ensure creator is properly formatted
              const creator = post.creator && !Array.isArray(post.creator) 
                ? post.creator 
                : Array.isArray(post.creator) && post.creator.length > 0
                ? post.creator[0]
                : null;

              return {
                ...post,
                creator: {
                  id: creator?.id || post.creator_id || '',
                  username: creator?.username || 'Anonymous',
                  avatar_url: creatorAvatarUrl,
                  bio: creator?.bio || '',
                  location: creator?.location || ''
                },
                media_assets: transformedMedia
              };
            } catch (error) {
              console.error("Error processing post:", post.id, error);
              return {
                ...post,
                creator: {
                  id: post.creator_id || '',
                  username: 'Anonymous',
                  avatar_url: null,
                  bio: '',
                  location: ''
                },
                media_assets: []
              };
            }
          })
        );

        console.log("Home - Posts with media processed:", postsWithMedia.length);
        return postsWithMedia;
      } catch (error) {
        console.error("Home - Failed to fetch posts:", error);
        throw error;
      }
    },
    enabled: !!session,
    retry: 3,
    staleTime: 0, // Always fetch fresh data
    refetchInterval: false // Disable auto-refetch, rely on real-time updates
  });

  // Add real-time updates for posts - this will trigger immediate refetch
  useRealtimeUpdates('posts', [], { column: 'visibility', value: 'public' });

  // Real-time updates for media_assets
  useRealtimeUpdates('media_assets');

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-darker">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mx-auto mb-4" />
          <p className="text-white">Loading your feed...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-darker">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">Error loading posts</p>
          <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
          <Button onClick={() => refetch()} variant="outline" className="mr-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Create wrapper functions that match EnhancedPostCard expectations
  const onLike = (postId: string) => {
    handleLike(postId, false);
    // Trigger immediate refetch for real-time feel
    setTimeout(() => refetch(), 100);
  };

  const onDelete = (postId: string, creatorId: string) => {
    handleDelete(postId);
    // Trigger immediate refetch
    setTimeout(() => refetch(), 100);
  };

  const handlePostCreated = () => {
    // Immediate refetch for real-time experience
    refetch();
    closeCreatePost();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-luxury-darker min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 lg:col-start-2 space-y-6">
          {/* Welcome Section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Eroxr</h1>
            <p className="text-gray-400">Discover amazing content from creators around the world</p>
          </div>

          {/* Stories */}
          <StoryReel />

          {/* Live Streams */}
          <LiveStreams />
          
          {/* Create Post Area */}
          <CreatePostArea 
            onCreatePost={openCreatePost}
            onGoLive={openGoLive}
          />
          
          {/* Posts Feed */}
          <div className="space-y-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <EnhancedPostCard
                  key={post.id}
                  post={post}
                  currentUserId={session?.user?.id}
                  onLike={onLike}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-luxury-card rounded-lg">
                <p className="text-gray-400 mb-2">No posts found</p>
                <p className="text-gray-500 text-sm mb-4">Be the first to create a post!</p>
                <Button onClick={openCreatePost} className="bg-luxury-primary hover:bg-luxury-primary/90">
                  Create First Post
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="lg:col-span-1 lg:col-start-4">
          <RightSidebar />
        </div>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={(open) => {
          if (!open) handlePostCreated();
          else openCreatePost();
        }}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </div>
  );
};

export default Home;
