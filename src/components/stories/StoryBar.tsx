
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { useStoriesFeed } from '@/hooks/useStoriesFeed';
import { useAuth } from '@/contexts/AuthContext';
import { StoryUploadModal } from './StoryUploadModal';
import { ImmersiveStoryViewer } from './ImmersiveStoryViewer';

interface Story {
  id: string;
  creator_id: string;
  media_url: string | null;
  video_url: string | null;
  content_type: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  creator: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}

export const StoryBar = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  
  const { stories, userStory, loading } = useStoriesFeed();
  const { user } = useAuth();

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setShowViewer(true);
  };

  const handleUserStoryClick = () => {
    if (userStory) {
      // View user's own story
      setSelectedStoryIndex(0);
      setShowViewer(true);
    } else {
      // Create new story
      setShowUploadModal(true);
    }
  };

  // Combine user story with other stories for viewer
  const allStories = userStory ? [userStory, ...stories] : stories;

  // Get user display info with fallbacks
  const getUserDisplayName = () => {
    if (!user) return 'You';
    return user.email?.split('@')[0] || 'You';
  };

  const getUserAvatar = () => {
    // Since User type doesn't have avatar_url, we'll return null
    // In a real app, you'd fetch this from a profiles table
    return null;
  };

  // Check if story is new (created within last 3 hours)
  const isNewStory = (createdAt: string) => {
    const storyTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    return (now - storyTime) < threeHours;
  };

  // Get story preview URL
  const getStoryPreviewUrl = (story: Story) => {
    return story.content_type === 'video' ? story.video_url : story.media_url;
  };

  if (loading) {
    return (
      <div className="w-full bg-background border-b border-border/50 py-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-background border-b border-border/50 py-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
          {/* User's Story or Add Story Button */}
          <motion.div
            className="flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUserStoryClick}
          >
            <div className="text-center">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full p-0.5 ${
                  userStory 
                    ? `bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500 ${
                        isNewStory(userStory.created_at) ? 'shadow-lg shadow-purple-500/50 animate-pulse' : ''
                      }`
                    : 'bg-gradient-to-tr from-gray-300 to-gray-500'
                }`}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    {userStory ? (
                      // Show story preview
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        {userStory.content_type === 'video' ? (
                          <video
                            src={getStoryPreviewUrl(userStory) || ''}
                            className="w-full h-full object-cover rounded-full"
                            muted
                          />
                        ) : (
                          <img
                            src={getStoryPreviewUrl(userStory) || ''}
                            alt="Your story"
                            className="w-full h-full object-cover rounded-full"
                          />
                        )}
                      </div>
                    ) : getUserAvatar() ? (
                      <img
                        src={getUserAvatar()!}
                        alt="Your story"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        {getUserDisplayName().slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                {!userStory && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <p className="text-xs text-center mt-1 text-muted-foreground truncate w-16">
                {userStory ? 'Your story' : 'Add story'}
              </p>
            </div>
          </motion.div>

          {/* Other Users' Stories */}
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              className="flex-shrink-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStoryClick(userStory ? index + 1 : index)}
            >
              <div className="text-center">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500 ${
                    isNewStory(story.created_at) ? 'shadow-lg shadow-purple-500/50 animate-pulse' : ''
                  }`}>
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        {story.content_type === 'video' ? (
                          <video
                            src={getStoryPreviewUrl(story) || ''}
                            className="w-full h-full object-cover rounded-full"
                            muted
                          />
                        ) : story.creator.avatar_url ? (
                          <img
                            src={getStoryPreviewUrl(story) || story.creator.avatar_url}
                            alt={story.creator.username || 'User'}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                            {(story.creator.username || 'U').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-center mt-1 text-muted-foreground truncate w-16">
                  {story.creator.username || 'User'}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Upload Story Button (Alternative) */}
          {stories.length === 0 && !userStory && (
            <motion.div
              className="flex-shrink-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground truncate w-16">
                  Share story
                </p>
              </div>
            </motion.div>
          )}
        </div>
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
