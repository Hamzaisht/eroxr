import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
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
      className="flex flex-col items-center space-y-2 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="relative">
        <motion.div
          className={`w-16 h-16 rounded-full p-0.5 ${
            hasStory
              ? 'bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary'
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
              <Plus className="w-6 h-6 text-luxury-primary" />
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
      
      <span className="text-xs text-luxury-neutral text-center max-w-[64px] truncate">
        {isOwn ? 'Your Story' : username}
      </span>
    </motion.div>
  );
};

export const StoryBar = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const session = useSession();
  const { stories, userStory, loading } = useStoriesFeed();

  if (loading) {
    return (
      <div className="w-full py-4 px-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-luxury-neutral/20" />
              <div className="w-12 h-3 bg-luxury-neutral/20 rounded" />
            </div>
          ))}
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
      // Show user's own story in viewer
      const userStoryData = [{
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full py-4 px-4 bg-luxury-darker/50 backdrop-blur-sm border-b border-luxury-neutral/10"
      >
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {/* User's own story */}
          {session?.user && (
            <StoryAvatar
              username={session.user.user_metadata?.username || 'You'}
              avatarUrl={session.user.user_metadata?.avatar_url}
              hasStory={!!userStory}
              isOwn={true}
              onClick={handleOwnStoryClick}
            />
          )}
          
          {/* Other users' stories */}
          {stories.map((story, index) => (
            <StoryAvatar
              key={story.id}
              username={story.creator.username || 'User'}
              avatarUrl={story.creator.avatar_url || undefined}
              hasStory={true}
              onClick={() => handleStoryClick(index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Upload Modal */}
      <StoryUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
      />

      {/* Story Viewer */}
      {showViewer && allStories.length > 0 && (
        <StoryViewer
          stories={allStories}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};
