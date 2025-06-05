
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useStoriesFeed = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [userStory, setUserStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          creator_id,
          media_url,
          video_url,
          content_type,
          created_at,
          expires_at,
          is_active,
          profiles:creator_id(id, username, avatar_url)
        `)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedStories = data?.map(story => {
        // Handle the profiles relationship correctly
        const profile = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles;
        
        return {
          ...story,
          creator: profile || { id: story.creator_id, username: 'Unknown', avatar_url: null }
        };
      }) || [];

      // Separate user's story from others
      const currentUserStory = formattedStories.find(story => story.creator_id === user?.id);
      const otherStories = formattedStories.filter(story => story.creator_id !== user?.id);

      setUserStory(currentUserStory || null);
      setStories(otherStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stories';
      setError(errorMessage);
      toast({
        title: 'Error loading stories',
        description: 'Failed to load stories. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({ is_active: false })
        .eq('id', storyId);

      if (error) throw error;

      // Update local state
      if (userStory?.id === storyId) {
        setUserStory(null);
      } else {
        setStories(prev => prev.filter(story => story.id !== storyId));
      }

      toast({
        title: 'Story deleted',
        description: 'Your story has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete story. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchStories();

    // Set up real-time subscription for new stories
    const channel = supabase
      .channel('stories-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories',
        },
        () => {
          fetchStories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    stories,
    userStory,
    loading,
    error,
    refetch: fetchStories,
    deleteStory,
  };
};
