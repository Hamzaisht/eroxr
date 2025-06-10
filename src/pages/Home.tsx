
import { useState, useCallback } from "react";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { RightSidebar } from "@/components/home/RightSidebar";
import { StoryBar } from "@/components/stories/StoryBar";
import { LiveStreams } from "@/components/home/LiveStreams";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { Loader2, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostActions } from "@/hooks/usePostActions";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useHomePosts } from "@/hooks/useHomePosts";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  console.log('Home component rendering');
  
  const { user, session, loading: authLoading } = useAuth();
  const { handleLike, handleDelete } = usePostActions();
  const { isOpen: isCreatePostOpen, openDialog: openCreatePost, closeDialog: closeCreatePost } = useCreatePostDialog();
  const { openDialog: openGoLive } = useGoLiveDialog();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!user && !!session;
  
  // Always fetch posts - the hook handles auth state internally
  const { data: posts, isLoading: postsLoading, error, refetch } = useHomePosts();

  // Define callbacks at top level - not conditionally
  const onLike = useCallback((postId: string) => {
    if (!isLoggedIn) return;
    console.log('Home - Liking post:', postId);
    handleLike(postId, false);
  }, [isLoggedIn, handleLike]);

  const onDelete = useCallback((postId: string, creatorId: string) => {
    if (!isLoggedIn) return;
    console.log('Home - Deleting post:', postId);
    handleDelete(postId);
  }, [isLoggedIn, handleDelete]);

  const handlePostCreated = useCallback(() => {
    console.log('Home - Post created, refreshing feed');
    if (refetch) {
      refetch();
    }
    closeCreatePost();
  }, [refetch, closeCreatePost]);

  const handleAuthAction = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  console.log('Home - Render state:', {
    authLoading,
    postsLoading,
    isLoggedIn,
    postsCount: posts?.length || 0,
    errorMessage: error instanceof Error ? error.message : 'Unknown error'
  });

  // Show loading only for initial auth check
  if (authLoading) {
    console.log('Home - Showing auth loading');
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-darker">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show posts loading
  if (postsLoading) {
    console.log('Home - Showing posts loading');
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
    console.log('Home - Showing error state');
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

  console.log('Home - Rendering main content');

  // Guest view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-luxury-darker">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 lg:col-start-2 space-y-8">
                {/* Welcome Header for Guests */}
                <div className="text-center space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
                      Welcome to Eroxr
                    </h1>
                    <p className="text-luxury-muted text-lg">Join our community to discover amazing creators</p>
                  </div>
                  <div className="space-y-4">
                    <Button 
                      onClick={handleAuthAction}
                      className="bg-luxury-primary hover:bg-luxury-primary/90 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Sign Up to Get Started
                    </Button>
                    <p className="text-gray-400 text-sm">
                      Already have an account?{" "}
                      <button 
                        onClick={handleAuthAction}
                        className="text-luxury-primary hover:underline"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </div>

                {/* Public Posts for Guests */}
                <div className="space-y-6">
                  {posts && posts.length > 0 ? (
                    posts.slice(0, 5).map((post) => (
                      <EnhancedPostCard
                        key={post.id}
                        post={post}
                        currentUserId={undefined}
                        onLike={onLike}
                        onDelete={onDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-luxury-card rounded-lg">
                      <p className="text-gray-400 mb-2">No posts available</p>
                      <p className="text-gray-500 text-sm mb-4">Join to see more content!</p>
                      <Button onClick={handleAuthAction} className="bg-luxury-primary hover:bg-luxury-primary/90">
                        Sign Up Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-1 lg:col-start-4">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user view
  return (
    <div className="min-h-screen bg-luxury-darker">
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 lg:col-start-2 space-y-8">
              {/* Stories Bar */}
              <div className="w-full">
                <StoryBar />
              </div>
              
              {/* Welcome Header */}
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
                    Welcome back{user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ''}
                  </h1>
                  <p className="text-luxury-muted text-lg">Discover amazing creators around the world</p>
                </div>
              </div>

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
                      currentUserId={user?.id}
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

          {isCreatePostOpen && (
            <CreatePostDialog
              open={isCreatePostOpen}
              onOpenChange={(open) => {
                if (!open) handlePostCreated();
                else openCreatePost();
              }}
              selectedFiles={selectedFiles}
              onFileSelect={setSelectedFiles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
