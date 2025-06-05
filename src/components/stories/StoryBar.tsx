
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStoriesFeed } from '@/hooks/useStoriesFeed';
import { StoryUploadModal } from './StoryUploadModal';
import { StoryViewer } from './StoryViewer';

interface StoryAvatarProps {
  username: string;
  avatarUrl?: string;
  hasStory?: boolean;
  isOwn?: boolean;
  onClick: () => void;
}

const StoryAvatar = ({ username, avatarUrl, hasStory = false, isOwn = false, onClick }: StoryAvatarProps) => {
  return (
    <motion.div
      className="flex flex-col items-center space-y-2 cursor-pointer min-w-[80px] flex-shrink-0"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="relative">
        <motion.div
          className={`w-16 h-16 rounded-full p-0.5 ${
            hasStory
              ? 'bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary'
              : isOwn
              ? 'bg-gradient-to-r from-luxury-primary/50 to-luxury-accent/50 border-2 border-dashed border-luxury-primary/60'
              : 'bg-luxury-neutral/20'
          }`}
          animate={hasStory ? {
            background: [
              'linear-gradient(45deg, #9333ea, #f59e0b, #ef4444)',
              'linear-gradient(90deg, #f59e0b, #ef4444, #9333ea)',
              'linear-gradient(135deg, #ef4444, #9333ea, #f59e0b)',
              'linear-gradient(45deg, #9333ea, #f59e0b, #ef4444)',
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-luxury-darker flex items-center justify-center overflow-hidden">
            {isOwn && !hasStory ? (
              <div className="flex flex-col items-center">
                <Plus className="w-6 h-6 text-luxury-primary mb-1" />
                <Camera className="w-4 h-4 text-luxury-accent" />
              </div>
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-luxury-neutral/20 rounded-full flex items-center justify-center">
                <span className="text-luxury-neutral text-sm font-semibold">
                  {username.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
        {hasStory && (
          <motion.div
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-50 blur-sm"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      
      <span className="text-xs text-luxury-neutral text-center max-w-[70px] truncate">
        {isOwn ? (hasStory ? 'Your Story' : 'Add Story') : username}
      </span>
    </motion.div>
  );
};

export const StoryBar = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const { user } = useAuth();
  const { stories, userStory, loading, error } = useStoriesFeed();

  console.log('StoryBar render:', { 
    user: user ? 'exists' : 'null',
    storiesCount: stories.length,
    userStory: userStory ? 'exists' : 'null',
    loading,
    error 
  });

  if (loading) {
    return (
      <div className="w-full py-4 px-4 bg-luxury-darker/50 backdrop-blur-sm border-b border-luxury-neutral/10">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 animate-pulse min-w-[80px] flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-luxury-neutral/20" />
              <div className="w-12 h-3 bg-luxury-neutral/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('StoryBar error:', error);
    return (
      <div className="w-full py-4 px-4 bg-luxury-darker/50 backdrop-blur-sm border-b border-luxury-neutral/10">
        <div className="text-center text-luxury-neutral text-sm">
          Unable to load stories
        </div>
      </div>
    );
  }

  const allStories = stories.map(story => ({
    id: story.id,
    creator_id: story.creator_id,
    media_url: story.media_url,
    video_url: story.video_url,
    content_type: story.content_type,
    created_at: story.created_at,
    expires_at: story.expires_at,
    is_active: story.is_active,
    creator: story.creator,
  }));

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setShowViewer(true);
  };

  const handleOwnStoryClick = () => {
    if (userStory) {
      const userStoryArray = [{
        id: userStory.id,
        creator_id: userStory.creator_id,
        media_url: userStory.media_url,
        video_url: userStory.video_url,
        content_type: userStory.content_type,
        created_at: userStory.created_at,
        expires_at: userStory.expires_at,
        is_active: userStory.is_active,
        creator: userStory.creator,
      }];
      setSelectedStoryIndex(0);
      setShowViewer(true);
    } else {
      setShowUploadModal(true);
    }
  };

  const handleCreateStory = () => {
    setShowUploadModal(true);
  };

  // Always show the stories bar, even if empty
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full py-4 px-4 bg-luxury-darker/50 backdrop-blur-sm border-b border-luxury-neutral/10 relative z-10"
      >
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {/* Always show user's own story option first if logged in */}
          {user && (
            <StoryAvatar
              username={user.user_metadata?.username || user.email?.split('@')[0] || 'You'}
              avatarUrl={user.user_metadata?.avatar_url}
              hasStory={!!userStory}
              isOwn={true}
              onClick={handleOwnStoryClick}
            />
          )}
          
          {/* Show other users' stories */}
          {stories.map((story, index) => (
            <StoryAvatar
              key={story.id}
              username={story.creator.username || 'User'}
              avatarUrl={story.creator.avatar_url || undefined}
              hasStory={true}
              onClick={() => handleStoryClick(index)}
            />
          ))}

          {/* Show create story prompt if no stories exist and user is logged in */}
          {user && stories.length === 0 && !userStory && (
            <motion.div
              className="flex flex-col items-center space-y-2 cursor-pointer min-w-[120px] bg-luxury-card/50 rounded-lg p-4 border border-luxury-primary/20 flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateStory}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-luxury-primary font-medium text-center">Create Story</span>
            </motion.div>
          )}
          
          {/* Show message if not logged in */}
          {!user && (
            <div className="flex items-center justify-center w-full py-8">
              <p className="text-luxury-neutral text-sm">Sign in to view and create stories</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Upload Modal */}
      <StoryUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
      />

      {/* Story Viewer */}
      {showViewer && (
        <StoryViewer
          stories={userStory && selectedStoryIndex === 0 ? [userStory] : allStories}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};
