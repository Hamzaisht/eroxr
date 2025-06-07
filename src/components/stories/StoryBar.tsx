import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStoriesFeed } from '@/hooks/useStoriesFeed';
import { StoryUploadModal } from './StoryUploadModal';
import { ImmersiveStoryViewer } from './ImmersiveStoryViewer';

interface StoryAvatarProps {
  username: string;
  avatarUrl?: string;
  hasStory?: boolean;
  isOwn?: boolean;
  onClick: () => void;
  index?: number;
}

const StoryAvatar = ({ username, avatarUrl, hasStory = false, isOwn = false, onClick, index = 0 }: StoryAvatarProps) => {
  return (
    <motion.div
      className="flex flex-col items-center space-y-3 cursor-pointer min-w-[85px] flex-shrink-0 group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative">
        {/* Floating particles around avatar */}
        <div className="absolute inset-0 -m-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-full"
              style={{
                top: `${20 + i * 20}%`,
                left: `${10 + i * 30}%`,
              }}
              animate={{
                y: [-4, 4, -4],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Animated gradient border */}
        <motion.div
          className={`w-20 h-20 rounded-full p-0.5 relative ${
            hasStory
              ? 'bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary'
              : isOwn
              ? 'bg-gradient-to-r from-luxury-primary/40 to-luxury-accent/40'
              : 'bg-gradient-to-r from-gray-600/30 to-gray-500/30'
          }`}
          animate={hasStory ? {
            background: [
              'linear-gradient(45deg, #9333ea, #f59e0b, #ef4444)',
              'linear-gradient(90deg, #f59e0b, #ef4444, #9333ea)',
              'linear-gradient(135deg, #ef4444, #9333ea, #f59e0b)',
              'linear-gradient(180deg, #9333ea, #f59e0b, #ef4444)',
            ]
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {/* Glass morphism inner container */}
          <div className="w-full h-full rounded-full bg-luxury-darker/80 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden relative">
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-transparent to-luxury-accent/10 rounded-full" />
            
            {isOwn && !hasStory ? (
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Plus className="w-7 h-7 text-luxury-primary mb-1" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="w-4 h-4 text-luxury-accent" />
                </motion.div>
              </div>
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover rounded-full relative z-10"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-luxury-neutral/20 to-luxury-neutral/10 rounded-full flex items-center justify-center relative z-10">
                <span className="text-luxury-neutral text-sm font-bold">
                  {username.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Floating glow effect */}
        {hasStory && (
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      
      {/* Username with better typography */}
      <motion.span 
        className="text-xs text-luxury-neutral text-center max-w-[80px] truncate font-medium tracking-wide group-hover:text-white transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
      >
        {isOwn ? (hasStory ? 'Your Story' : 'Create Story') : username}
      </motion.span>
    </motion.div>
  );
};

export const StoryBar = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const { user } = useAuth();
  const { stories, userStory, loading, error } = useStoriesFeed();

  if (loading) {
    return (
      <div className="w-full py-6 px-6 bg-gradient-to-r from-luxury-darker/60 via-luxury-darker/40 to-luxury-darker/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col items-center space-y-3 min-w-[85px] flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-br from-luxury-neutral/20 to-luxury-neutral/10 backdrop-blur-sm"
                animate={{ 
                  background: [
                    'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(245, 158, 11, 0.1))',
                    'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.1))',
                    'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(147, 51, 234, 0.1))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="w-12 h-3 bg-luxury-neutral/20 rounded-full animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-6 px-6 bg-gradient-to-r from-luxury-darker/60 via-luxury-darker/40 to-luxury-darker/60 backdrop-blur-xl border-b border-white/5">
        <div className="text-center text-luxury-neutral text-sm flex items-center justify-center space-x-2">
          <Zap className="w-4 h-4 text-red-400" />
          <span>Unable to load stories</span>
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
      setSelectedStoryIndex(0);
      setShowViewer(true);
    } else {
      setShowUploadModal(true);
    }
  };

  const handleCreateStory = () => {
    setShowUploadModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full py-6 px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.9) 0%, rgba(23, 23, 23, 0.8) 50%, rgba(13, 13, 13, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Animated background mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-luxury-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-tl from-luxury-accent/20 to-transparent rounded-full blur-2xl animate-pulse" />
        </div>

        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2 relative z-10">
          {/* User's own story */}
          {user && (
            <StoryAvatar
              username={user.user_metadata?.username || user.email?.split('@')[0] || 'You'}
              avatarUrl={user.user_metadata?.avatar_url}
              hasStory={!!userStory}
              isOwn={true}
              onClick={handleOwnStoryClick}
              index={0}
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
              index={index + 1}
            />
          ))}

          {/* Create story prompt for empty state */}
          {user && stories.length === 0 && !userStory && (
            <motion.div
              className="flex flex-col items-center space-y-4 cursor-pointer min-w-[140px] bg-gradient-to-br from-luxury-card/60 to-luxury-card/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex-shrink-0 group hover:border-luxury-primary/50 transition-all duration-500"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateStory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div 
                className="w-14 h-14 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent flex items-center justify-center relative overflow-hidden"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/50 to-luxury-accent/50 animate-pulse" />
                <Plus className="w-7 h-7 text-white relative z-10" />
              </motion.div>
              <div className="text-center">
                <span className="text-sm text-luxury-primary font-semibold mb-1 block">Create Story</span>
                <div className="flex items-center space-x-1 text-xs text-luxury-neutral">
                  <Sparkles className="w-3 h-3" />
                  <span>Share your moment</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Not logged in message */}
          {!user && (
            <div className="flex items-center justify-center w-full py-8">
              <motion.p 
                className="text-luxury-neutral text-sm bg-luxury-card/30 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Sign in to view and create stories
              </motion.p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <StoryUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
      />

      {showViewer && (
        <ImmersiveStoryViewer
          stories={userStory && selectedStoryIndex === 0 ? [userStory] : stories}
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};
