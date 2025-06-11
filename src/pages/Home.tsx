
import { useState, useCallback } from "react";
import { CreatePostArea } from "@/components/home/CreatePostArea";
import { RightSidebar } from "@/components/home/RightSidebar";
import { StoryBar } from "@/components/stories/StoryBar";
import { LiveStreams } from "@/components/home/LiveStreams";
import { EnhancedPostCard } from "@/components/feed/EnhancedPostCard";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { Loader2, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostActions } from "@/hooks/usePostActions";
import { useCreatePostDialog } from "@/hooks/useCreatePostDialog";
import { useGoLiveDialog } from "@/hooks/useGoLiveDialog";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useHomePosts } from "@/hooks/useHomePosts";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { HomeLayout } from "@/components/home/HomeLayout";

const Home = () => {
  console.log('Home component rendering');
  
  const { user, session, loading: authLoading } = useAuth();
  const { handleLike, handleDelete } = usePostActions();
  const { isOpen: isCreatePostOpen, openDialog: openCreatePost, closeDialog: closeCreatePost } = useCreatePostDialog();
  const { openDialog: openGoLive } = useGoLiveDialog();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = !!user && !!session;
  
  // Always fetch posts - the hook handles auth state internally
  const { data: posts, isLoading: postsLoading, error, refetch } = useHomePosts();

  // Define callbacks at top level - not conditionally
  const onLike = useCallback((postId: string) => {
    if (!isLoggedIn) return;
    console.log('Home - Liking post:', postId);
    handleLike(postId);
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

  const handleWelcomeDismiss = useCallback(() => {
    setShowWelcomeBanner(false);
  }, []);

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
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mx-auto mb-4" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  // Show posts loading
  if (postsLoading) {
    console.log('Home - Showing posts loading');
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mx-auto mb-4" />
            <p className="text-white">Loading your feed...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  if (error) {
    console.log('Home - Showing error state');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
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
      </HomeLayout>
    );
  }

  console.log('Home - Rendering main content');

  // Guest view
  if (!isLoggedIn) {
    return (
      <HomeLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Header for Guests */}
            <div className="text-center space-y-6 p-8 bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 rounded-2xl border border-luxury-primary/20 backdrop-blur-sm">
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent font-display">
                  Welcome to Eroxr
                </h1>
                <p className="text-luxury-muted text-xl">Join our exclusive creator community</p>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={handleAuthAction}
                  size="xl"
                  className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white px-12 py-6 rounded-full font-semibold text-lg shadow-luxury hover:shadow-luxury-hover transform hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="h-6 w-6 mr-3" />
                  Join the Studio
                </Button>
                <p className="text-gray-400 text-sm">
                  Already a member?{" "}
                  <button 
                    onClick={handleAuthAction}
                    className="text-luxury-primary hover:text-luxury-accent transition-colors hover:underline"
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
                <div className="text-center py-16 bg-gradient-to-br from-luxury-dark/50 to-luxury-darker/50 rounded-2xl border border-luxury-primary/10 backdrop-blur-sm">
                  <p className="text-gray-400 mb-2 text-lg">No posts available</p>
                  <p className="text-gray-500 text-sm mb-6">Join to see exclusive content!</p>
                  <Button 
                    onClick={handleAuthAction} 
                    className="bg-luxury-primary hover:bg-luxury-primary/90 shadow-luxury"
                    size="lg"
                  >
                    Sign Up Now
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <RightSidebar />
          </div>
        </div>
      </HomeLayout>
    );
  }

  // Logged-in user view
  return (
    <HomeLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Auto-dismissing Welcome Banner */}
          {showWelcomeBanner && (
            <WelcomeBanner 
              username={user?.user_metadata?.username}
              onDismiss={handleWelcomeDismiss}
            />
          )}

          {/* Stories Bar */}
          <div className="w-full">
            <StoryBar />
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
              <div className="text-center py-16 bg-gradient-to-br from-luxury-dark/50 to-luxury-darker/50 rounded-2xl border border-luxury-primary/10 backdrop-blur-sm">
                <p className="text-gray-400 mb-2 text-lg">No posts found</p>
                <p className="text-gray-500 text-sm mb-6">Be the first to create a masterpiece!</p>
                <Button 
                  onClick={openCreatePost} 
                  className="bg-luxury-primary hover:bg-luxury-primary/90 shadow-luxury"
                  size="lg"
                >
                  Create First Post
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
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
    </HomeLayout>
  );
};

export default Home;
