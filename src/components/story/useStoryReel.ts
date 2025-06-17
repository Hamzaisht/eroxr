import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

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
          duration,
          created_at,
          expires_at,
          is_active,
          profiles:creator_id(username, avatar_url)
        `)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: true }); // Changed to ascending for chronological order

      if (error) throw error;
      return safeCast<StoryData[]>(data);
    },
  });

  // Set up real-time subscription for stories
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('stories-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories',
        },
        (payload) => {
          console.log('Story real-time update:', payload);
          // Invalidate and refetch stories when any story changes
          queryClient.invalidateQueries({ queryKey: ['stories'] });
        }
      )
      .subscribe();

    // Listen for story upload events
    const handleStoryUpload = () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    };

    // Listen for story deletion events
    const handleStoryDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    };

    window.addEventListener('story-uploaded', handleStoryUpload);
    window.addEventListener('story-deleted', handleStoryDeleted);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('story-uploaded', handleStoryUpload);
      window.removeEventListener('story-deleted', handleStoryDeleted);
    };
  }, [user?.id, queryClient]);

  // Ensure stories is a safe array to map over
  const safeStories = safeDataAccess(stories, []);

  // Convert to the format expected by StoryViewer
  const formattedStories: Story[] = safeStories.map((story) => ({
    id: story.id,
    creator_id: story.creator_id,
    media_url: story.media_url,
    video_url: story.video_url,
    content_type: story.content_type || 'image',
    duration: story.duration,
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
      // Find the actual index of user's story in the combined array
      const userStoryIndex = formattedStories.findIndex(story => story.creator_id === user?.id);
      setSelectedStoryIndex(userStoryIndex >= 0 ? userStoryIndex : 0);
      setShowViewer(true);
    } else {
      // Create new story
      setShowUploadModal(true);
    }
  };

  // Use all stories in chronological order for viewer
  const allStories = formattedStories;

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
