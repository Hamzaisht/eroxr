import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage, UploadOptions } from '@/utils/mediaUtils';
import { Story } from '@/integrations/supabase/types/story';

export interface UseStoriesResult {
  stories: Story[];
  myStories: Story[];
  isLoading: boolean;
  error: string | null;
  loadStories: () => Promise<void>;
  loadMoreStories: () => Promise<void>;
  hasMoreStories: boolean;
  uploadStory: (
    file: File,
    options?: {
      isVideo?: boolean;
    }
  ) => Promise<{ success: boolean; url?: string; error?: string }>;
  viewStory: (storyId: string) => Promise<void>;
  refreshStories: () => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
}

export const useStories = (): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreStories, setHasMoreStories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const STORIES_PAGE_LIMIT = 10;
  const [storiesPage, setStoriesPage] = useState(0);

  /**
   * Load stories from Supabase
   */
  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setStoriesPage(0);
    setHasMoreStories(true);

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, STORIES_PAGE_LIMIT - 1);

      if (error) {
        console.error('Error fetching stories:', error);
        setError('Failed to load stories');
        toast({
          title: 'Error',
          description: 'Failed to load stories',
          variant: 'destructive',
        });
        return;
      }

      setStories(data);
      if (data.length < STORIES_PAGE_LIMIT) {
        setHasMoreStories(false);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
      toast({
        title: 'Error',
        description: 'Failed to load stories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Load more stories from Supabase
   */
  const loadMoreStories = useCallback(async () => {
    if (!hasMoreStories) return;

    setIsLoading(true);
    const nextPage = storiesPage + 1;
    const rangeStart = nextPage * STORIES_PAGE_LIMIT;
    const rangeEnd = rangeStart + STORIES_PAGE_LIMIT - 1;

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })
        .range(rangeStart, rangeEnd);

      if (error) {
        console.error('Error fetching more stories:', error);
        setError('Failed to load more stories');
        toast({
          title: 'Error',
          description: 'Failed to load more stories',
          variant: 'destructive',
        });
        return;
      }

      if (!data || data.length === 0) {
        setHasMoreStories(false);
      } else {
        setStories((prevStories) => [...prevStories, ...data]);
        setStoriesPage(nextPage);
        if (data.length < STORIES_PAGE_LIMIT) {
          setHasMoreStories(false);
        }
      }
    } catch (err) {
      console.error('Error fetching more stories:', err);
      setError('Failed to load more stories');
      toast({
        title: 'Error',
        description: 'Failed to load more stories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [hasMoreStories, storiesPage, toast]);

  /**
   * Refresh stories from Supabase
   */
  const refreshStories = useCallback(async () => {
    await loadStories();
  }, [loadStories]);

  /**
   * Load my stories from Supabase
   */
  const loadMyStories = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching my stories:', error);
        setError('Failed to load your stories');
        toast({
          title: 'Error',
          description: 'Failed to load your stories',
          variant: 'destructive',
        });
        return;
      }

      setMyStories(data);
    } catch (err) {
      console.error('Error fetching my stories:', err);
      setError('Failed to load your stories');
      toast({
        title: 'Error',
        description: 'Failed to load your stories',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);

  /**
   * View a story
   */
  const viewStory = useCallback(async (storyId: string) => {
    try {
      // Increment the view count for the story
      const { error } = await supabase
        .from('stories')
        .update({ views: () => 'views + 1' })
        .eq('id', storyId);

      if (error) {
        console.error('Error viewing story:', error);
        toast({
          title: 'Error',
          description: 'Failed to view story',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error viewing story:', err);
      toast({
        title: 'Error',
        description: 'Failed to view story',
        variant: 'destructive',
      });
    }
  }, [toast]);

  /**
   * Delete a story
   */
  const deleteStory = useCallback(async (storyId: string) => {
    try {
      // Delete the story from Supabase
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) {
        console.error('Error deleting story:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete story',
          variant: 'destructive',
        });
        return;
      }

      // Update the stories state
      setStories((prevStories) => prevStories.filter((story) => story.id !== storyId));
      setMyStories((prevStories) => prevStories.filter((story) => story.id !== storyId));

      toast({
        title: 'Success',
        description: 'Story deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting story:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete story',
        variant: 'destructive',
      });
    }
  }, [toast]);
  
  /**
   * Upload a story to Supabase storage
   */
  const uploadStory = async (
    file: File,
    options?: {
      isVideo?: boolean;
    }
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      if (!session?.user?.id) {
        return { success: false, error: 'User not authenticated' };
      }

      // Upload to storage
      const uploadOptions: UploadOptions = {
        contentCategory: 'story'
      };
      
      const result = await uploadFileToStorage(
        file,
        session.user.id,
        uploadOptions
      );
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      if (!result.url) {
        return { success: false, error: 'No URL returned from upload' };
      }
      
      // Insert story into database
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .insert({
          user_id: session.user.id,
          media_url: result.url,
          is_video: !!options?.isVideo,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h expiry
        })
        .select('*')
        .single();
      
      if (storyError) {
        console.error('Error creating story record:', storyError);
        // Even if DB insert fails, return success with URL since media is uploaded
        return { 
          success: true, 
          url: result.url,
          error: 'Media uploaded but story record creation failed'
        };
      }
      
      // Broadcast update
      window.dispatchEvent(new CustomEvent('story-created', {
        detail: {
          story: storyData
        }
      }));
      
      return { 
        success: true, 
        url: result.url
      };
    } catch (error: any) {
      console.error('Story upload error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    stories,
    myStories,
    isLoading,
    error,
    loadStories,
    loadMoreStories,
    hasMoreStories,
    uploadStory,
    viewStory,
    refreshStories,
    deleteStory
  };
};
