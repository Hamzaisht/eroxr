
import { memo, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { EnhancedStoryViewer } from "./stories/EnhancedStoryViewer";
import { StoryUploadModal } from "./stories/StoryUploadModal";
import { StoryAvatar } from "./story/StoryAvatar";
import { useStoryReel } from "./story/useStoryReel";

export const StoryReel = memo(() => {
  const {
    userStory,
    otherStories,
    allStories,
    isLoading,
    showViewer,
    setShowViewer,
    selectedStoryIndex,
    showUploadModal,
    setShowUploadModal,
    handleStoryClick,
    handleUserStoryClick,
    getUserDisplayName,
    getUserAvatar,
  } = useStoryReel();

  const handleCloseViewer = useCallback(() => {
    setShowViewer(false);
  }, [setShowViewer]);

  const handleCloseUpload = useCallback((open: boolean) => {
    setShowUploadModal(open);
  }, [setShowUploadModal]);

  // Listen for story upload events from the viewer
  useEffect(() => {
    const handleOpenUpload = () => {
      setShowUploadModal(true);
    };

    window.addEventListener('open-story-upload', handleOpenUpload);
    return () => window.removeEventListener('open-story-upload', handleOpenUpload);
  }, [setShowUploadModal]);

  // Handle clicking on other users' stories with proper index mapping
  const handleOtherStoryClick = useCallback((storyToFind: any) => {
    // Find the exact index of this story in the allStories array
    const storyIndex = allStories.findIndex(story => story.id === storyToFind.id);
    console.log('Clicking on story:', storyToFind.id, 'at index:', storyIndex);
    
    if (storyIndex >= 0) {
      handleStoryClick(storyIndex);
    }
  }, [allStories, handleStoryClick]);

  if (isLoading) {
    return (
      <div className="relative z-10 flex items-center justify-start w-full gap-3 sm:gap-4 px-2 sm:px-4 py-4 sm:py-6 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="relative z-10 flex items-center justify-start w-full gap-3 sm:gap-4 px-2 sm:px-4 py-4 sm:py-6 overflow-x-auto story-reel">
        {/* User's Story or Add Story Button */}
        <StoryAvatar
          story={userStory}
          isUserStory={true}
          displayName={getUserDisplayName()}
          avatarUrl={getUserAvatar()}
          onClick={handleUserStoryClick}
        />

        {/* Other Users' Stories */}
        {otherStories.map((story) => (
          <StoryAvatar
            key={story.id}
            story={story}
            displayName={story.creator.username || 'User'}
            onClick={() => handleOtherStoryClick(story)}
          />
        ))}
      </div>

      {/* Story Upload Modal */}
      <StoryUploadModal 
        open={showUploadModal} 
        onOpenChange={handleCloseUpload} 
      />

      {/* Enhanced Story Viewer */}
      <AnimatePresence>
        {showViewer && allStories.length > 0 && (
          <EnhancedStoryViewer
            stories={allStories}
            initialStoryIndex={selectedStoryIndex}
            onClose={handleCloseViewer}
          />
        )}
      </AnimatePresence>
    </>
  );
});

StoryReel.displayName = "StoryReel";
