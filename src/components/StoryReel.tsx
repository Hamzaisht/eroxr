
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StoryCard } from "./story/StoryCard";
import { ImmersiveStoryViewer } from "./stories/ImmersiveStoryViewer";
import { StoryUploadModal } from "./stories/StoryUploadModal";
import { useAuth } from "@/contexts/AuthContext";
import { 
  safeCast, 
  safeDataAccess
} from "@/utils/supabase/helpers";
import { Database } from "@/integrations/supabase/types/database.types";

type StoryData = Database["public"]["Tables"]["stories"]["Row"] & {
  profiles?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

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

export const StoryReel = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          creator_id,
          media_url,
          video_url,
          content_type,
          created_at,
          expires_at,
          is_active,
          profiles:creator_id(username, avatar_url)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return safeCast<StoryData[]>(data);
    },
  });

  // Ensure stories is a safe array to map over
  const safeStories = safeDataAccess(stories, []);

  // Convert to the format expected by ImmersiveStoryViewer
  const formattedStories: Story[] = safeStories.map((story) => ({
    id: story.id,
    creator_id: story.creator_id,
    media_url: story.media_url,
    video_url: story.video_url,
    content_type: story.content_type || 'image',
    created_at: story.created_at,
    expires_at: story.expires_at,
    is_active: story.is_active || false,
    creator: {
      id: story.creator_id,
      username: story.profiles?.username || 'User',
      avatar_url: story.profiles?.avatar_url || null,
    }
  }));

  // Separate user's own story from others
  const userStory = formattedStories.find(story => story.creator_id === user?.id);
  const otherStories = formattedStories.filter(story => story.creator_id !== user?.id);

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
  const allStories = userStory ? [userStory, ...otherStories] : otherStories;

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
                  ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500'
                  : 'bg-gradient-to-tr from-gray-300 to-gray-500'
              }`}>
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  {userStory ? (
                    // Show story preview
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      {userStory.content_type === 'video' ? (
                        <video
                          src={userStory.video_url || ''}
                          className="w-full h-full object-cover rounded-full"
                          muted
                        />
                      ) : (
                        <img
                          src={userStory.media_url || ''}
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
        {otherStories.map((story, index) => (
          <motion.div
            key={story.id}
            className="flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStoryClick(userStory ? index + 1 : index)}
          >
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      {story.content_type === 'video' ? (
                        <video
                          src={story.video_url || ''}
                          className="w-full h-full object-cover rounded-full"
                          muted
                        />
                      ) : story.creator.avatar_url ? (
                        <img
                          src={story.media_url || story.creator.avatar_url}
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
