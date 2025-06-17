import { AnimatePresence } from "framer-motion";
import { ImmersiveStoryViewer } from "./stories/ImmersiveStoryViewer";
import { StoryUploadModal } from "./stories/StoryUploadModal";
import { StoryAvatar } from "./story/StoryAvatar";
import { useStoryReel } from "./story/useStoryReel";
import { useEffect } from "react";

export const StoryReel = () => {
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

  // Listen for story updates
  useEffect(() => {
    const handleStoryUpdate = () => {
      // Refresh stories when uploaded or deleted
      window.location.reload();
    };

    window.addEventListener('story-uploaded', handleStoryUpdate);
    window.addEventListener('story-deleted', handleStoryUpdate);

    return () => {
      window.removeEventListener('story-uploaded', handleStoryUpdate);
      window.removeEventListener('story-deleted', handleStoryUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="relative z-10 flex items-center justify-start w-full gap-4 px-4 py-6 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="relative z-10 flex items-center justify-start w-full gap-4 px-4 py-6 overflow-x-auto">
        {/* User's Story or Add Story Button */}
        <StoryAvatar
          story={userStory}
          isUserStory={true}
          displayName={getUserDisplayName()}
          avatarUrl={getUserAvatar()}
          onClick={handleUserStoryClick}
        />

        {/* Other Users' Stories */}
        {otherStories.map((story, index) => (
          <StoryAvatar
            key={story.id}
            story={story}
            displayName={story.creator.username || 'User'}
            onClick={() => handleStoryClick(userStory ? index + 1 : index)}
          />
        ))}
      </div>

      {/* Story Upload Modal */}
      <StoryUploadModal 
        open={showUploadModal} 
        onOpenChange={setShowUploadModal} 
      />

      {/* Immersive Story Viewer */}
      <AnimatePresence>
        {showViewer && allStories.length > 0 && (
          <ImmersiveStoryViewer
            stories={allStories}
            initialStoryIndex={selectedStoryIndex}
            onClose={() => setShowViewer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
