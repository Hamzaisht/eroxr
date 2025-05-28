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
            metadata,
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
        
        // For each post, fetch associated media assets using STRICT primary strategy only
        const postsWithMedia = await Promise.all(
          postsData.map(async (post) => {
            try {
              console.log(`Home - Fetching media for post ${post.id}...`);
              
              // STRATEGY 1: PRIMARY - fetch media by post_id in metadata (ONLY strategy)
              const { data: primaryAssets, error: primaryError } = await supabase
                .from('media_assets')
                .select('*')
                .filter('metadata->>post_id', 'eq', post.id);

              if (primaryError) {
                console.error("Home - Error in primary media fetch:", primaryError);
              }

              console.log(`Home - Primary media assets for post ${post.id}:`, primaryAssets?.length || 0);

              let mediaAssets = primaryAssets || [];

              // FALLBACK STRATEGY: Heavily restricted to prevent cross-contamination
              // Only for very recent posts (30 seconds max) and very specific conditions
              if (mediaAssets.length === 0) {
                console.log(`Home - No primary media found for post ${post.id}, checking fallback conditions...`);
                
                const postTime = new Date(post.created_at);
                const currentTime = new Date();
                const postAgeSeconds = (currentTime.getTime() - postTime.getTime()) / 1000;
                
                // Only use fallback for posts created within the last 30 seconds
                if (postAgeSeconds <= 30) {
                  console.log(`Home - Post ${post.id} is very recent (${postAgeSeconds.toFixed(1)} seconds old), attempting restricted fallback...`);
                  
                  const fallbackStartTime = new Date(postTime.getTime() - 30 * 1000); // 30 seconds before
                  const fallbackEndTime = new Date(postTime.getTime() + 30 * 1000); // 30 seconds after

                  const { data: recentOrphanedAssets, error: orphanedError } = await supabase
                    .from('media_assets')
                    .select('*')
                    .eq('user_id', post.creator_id) // MUST be same user
                    .filter('metadata->>usage', 'eq', 'post')
                    .is('metadata->>post_id', null) // MUST be orphaned
                    .eq('access_level', 'public') // MUST be public
                    .gte('created_at', fallbackStartTime.toISOString())
                    .lte('created_at', fallbackEndTime.toISOString())
                    .limit(3); // MAX 3 media items

                  if (orphanedError) {
                    console.error("Home - Error in orphaned media fetch:", orphanedError);
                  } else {
                    console.log(`Home - Recent orphaned media assets for post ${post.id}:`, recentOrphanedAssets?.length || 0);
                    
                    if (recentOrphanedAssets && recentOrphanedAssets.length > 0) {
                      // Additional safety: verify timing within 30 seconds
                      const safeAssets = recentOrphanedAssets.filter(asset => {
                        const assetTime = new Date(asset.created_at);
                        const timeDiff = Math.abs(assetTime.getTime() - postTime.getTime()) / 1000;
                        return timeDiff <= 30;
                      });
                      
                      if (safeAssets.length > 0) {
                        // DO NOT auto-link to prevent cross-contamination
                        mediaAssets = safeAssets;
                        console.log(`Home - Using ${safeAssets.length} safe orphaned assets for post ${post.id} (NOT auto-linking)`);
                      }
                    }
                  }
                } else {
                  console.log(`Home - Post ${post.id} is too old (${postAgeSeconds.toFixed(1)} seconds) for fallback, skipping`);
                }
              }

              // Fetch creator avatar from media_assets
              let creatorAvatarUrl = null;
              if (post.creator_id) {
                const { data: avatarData } = await supabase
                  .from('media_assets')
                  .select('storage_path')
                  .eq('user_id', post.creator_id)
                  .filter('metadata->>usage', 'eq', 'avatar')
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

              // Ensure creator is properly formatted
              const creator = post.creator && !Array.isArray(post.creator) 
                ? post.creator 
                : Array.isArray(post.creator) && post.creator.length > 0
                ? post.creator[0]
                : null;

              const finalPost = {
                ...post,
                creator: {
                  id: creator?.id || post.creator_id || '',
                  username: creator?.username || 'Anonymous',
                  avatar_url: creatorAvatarUrl,
                  bio: creator?.bio || '',
                  location: creator?.location || ''
                },
                // Pass raw media assets directly
                media_assets: mediaAssets
              };

              console.log(`Home - Final post ${post.id} media count:`, finalPost.media_assets.length);
              if (finalPost.media_assets.length > 0) {
                console.log(`Home - Final post ${post.id} media details:`, finalPost.media_assets.map(m => ({ 
                  id: m.id, 
                  created_at: m.created_at,
                  has_post_id: !!m.metadata?.post_id,
                  post_id: m.metadata?.post_id,
                  user_id: m.user_id
                })));
              }
              
              return finalPost;
            } catch (error) {
              console.error("Home - Error processing post:", post.id, error);
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
        
        // Log posts with media for debugging
        postsWithMedia.forEach(post => {
          if (post.media_assets.length > 0) {
            console.log(`Home - Post ${post.id} has ${post.media_assets.length} media assets`);
          }
        });
        
        return postsWithMedia;
      } catch (error) {
        console.error("Home - Failed to fetch posts:", error);
        throw error;
      }
    },
    enabled: !!session,
    retry: 3,
    staleTime: 0,
    refetchInterval: false
  });

  // Add real-time updates for posts
  useRealtimeUpdates('posts', [], { column: 'visibility', value: 'public' });
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
    setTimeout(() => refetch(), 100);
  };

  const onDelete = (postId: string, creatorId: string) => {
    handleDelete(postId);
    setTimeout(() => refetch(), 100);
  };

  const handlePostCreated = () => {
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
