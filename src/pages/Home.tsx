
import { useState } from "react";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { RightSidebar } from "@/components/home/RightSidebar";
import { StoryBar } from "@/components/stories/StoryBar";
import { LiveStreams } from "@/components/home/LiveStreams";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostActions } from "@/hooks/usePostActions";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { useHomePosts } from "@/hooks/useHomePosts";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { session } = useAuth();
  const { handleLike, handleDelete } = usePostActions();
  const { isOpen: isCreatePostOpen, openDialog: openCreatePost, closeDialog: closeCreatePost } = useCreatePostDialog();
  const { openDialog: openGoLive } = useGoLiveDialog();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const { data: posts, isLoading, error, refetch } = useHomePosts();

  useRealtimeUpdates('posts', [], { column: 'visibility', value: 'public' });
  useRealtimeUpdates('media_assets');

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
        <div className="lg:col-span-2 lg:col-start-2 space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Eroxr</h1>
            <p className="text-gray-400">Discover amazing content from creators around the world</p>
          </div>

          {/* Modern Stories Bar */}
          <StoryBar />
          
          <LiveStreams />
          
          <CreatePostArea 
            onCreatePost={openCreatePost}
            onGoLive={openGoLive}
          />
          
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
        
        <div className="lg:col-span-1 lg:col-start-4">
          <RightSidebar />
        </div>
      </div>

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
