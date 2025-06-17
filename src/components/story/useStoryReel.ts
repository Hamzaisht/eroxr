
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  safeCast, 
  safeDataAccess
} from "@/utils/supabase/helpers";
import { StoryData, Story } from "./types";

export const useStoryReel = () => {
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

  return {
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
  };
};
