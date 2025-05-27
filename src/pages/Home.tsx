
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

const Home = () => {
  const session = useSession();
  const { handleLike, handleDelete } = usePostActions();
  const { isOpen: isCreatePostOpen, openDialog: openCreatePost, closeDialog: closeCreatePost } = useCreatePostDialog();
  const { openDialog: openGoLive } = useGoLiveDialog();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['home-posts'],
    queryFn: async () => {
      console.log("Home - Fetching posts with profiles...");
      
      // Fetch posts with creator profiles (NO avatar_url)
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
          creator:profiles!posts_creator_id_fkey(id, username)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        console.error("Home - Error fetching posts:", postsError);
        throw new Error(postsError.message || "Failed to fetch posts");
      }

      console.log("Home - Posts fetched:", postsData?.length || 0);
      
      // For each post, fetch associated media assets and creator avatars
      const postsWithMedia = await Promise.all(
        (postsData || []).map(async (post) => {
          try {
            // Query media assets for this post
            const { data: mediaAssets, error: mediaError } = await supabase
              .from('media_assets')
              .select('id, storage_path, original_name, media_type, alt_text, metadata')
              .eq('metadata->post_id', post.id)
              .order('created_at', { ascending: false })
              .limit(4);

            if (mediaError) {
              console.error("Error fetching media for post:", post.id, mediaError);
            }

            // Fetch creator avatar from media_assets
            let creatorAvatarUrl = null;
            if (post.creator_id) {
              const { data: avatarData } = await supabase
                .from('media_assets')
                .select('storage_path')
                .eq('user_id', post.creator_id)
                .eq('media_type', 'image')
                .eq('metadata->usage', 'avatar')
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

            // Transform media assets to include full URL
            const transformedMedia = (mediaAssets || []).map(asset => ({
              id: asset.id,
              url: `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/media/${asset.storage_path}`,
              type: asset.media_type,
              alt_text: asset.alt_text
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
                avatar_url: creatorAvatarUrl
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
                avatar_url: null
              },
              media_assets: []
            };
          }
        })
      );

      return postsWithMedia;
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
          <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                  onLike={handleLike}
                  onDelete={handleDelete}
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
        
        {/* Right Sidebar */}
        <div className="lg:col-span-1 lg:col-start-4">
          <RightSidebar />
        </div>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={closeCreatePost}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </div>
  );
};

export default Home;
