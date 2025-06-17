
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Story } from "./types";

interface StoryAvatarProps {
  story?: Story;
  isUserStory?: boolean;
  displayName: string;
  avatarUrl?: string | null;
  onClick: () => void;
}

export const StoryAvatar = ({ 
  story, 
  isUserStory = false, 
  displayName, 
  avatarUrl, 
  onClick 
}: StoryAvatarProps) => {
  return (
    <motion.div
      className="flex-shrink-0 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="relative">
          <div className={`w-16 h-16 rounded-full p-0.5 ${
            story 
              ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500'
              : 'bg-gradient-to-tr from-gray-300 to-gray-500'
          }`}>
            <div className="w-full h-full rounded-full bg-white p-0.5">
              {story ? (
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {story.content_type === 'video' ? (
                    <video
                      src={story.video_url || ''}
                      className="w-full h-full object-cover rounded-full"
                      muted
                    />
                  ) : (
                    <img
                      src={story.media_url || ''}
                      alt={`${displayName}'s story`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName}'s avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          {isUserStory && !story && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Plus className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <p className="text-xs text-center mt-1 text-muted-foreground truncate w-16">
          {isUserStory && !story ? 'Add story' : 
           isUserStory && story ? 'Your story' : 
           displayName}
        </p>
      </div>
    </motion.div>
  );
};
