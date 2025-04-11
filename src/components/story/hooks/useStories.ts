
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/integrations/supabase/types/story';
import { useSession } from '@supabase/auth-helpers-react';
import { uploadFileToStorage, UploadOptions } from '@/utils/mediaUtils';

interface GroupedStories {
  [creatorId: string]: Story[];
}

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [creatorStories, setCreatorStories] = useState<GroupedStories>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const session = useSession();

  // Fetch stories
  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch active stories that haven't expired
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select('*')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      // Group stories by creator
      const groupedByCreator: GroupedStories = {};
      data.forEach((story: Story) => {
        if (!groupedByCreator[story.creator_id]) {
          groupedByCreator[story.creator_id] = [];
        }
        groupedByCreator[story.creator_id].push(story);
      });
      
      setStories(data || []);
      setCreatorStories(groupedByCreator);
      setError('');
    } catch (err: any) {
      console.error('Error fetching stories:', err);
      setError(err.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh stories
  const refreshStories = useCallback(async () => {
    await fetchStories();
    return { success: true };
  }, [fetchStories]);

  // Upload a story
  const uploadStory = useCallback(async (
    file: File, 
    options: { isVideo?: boolean } = {}
  ) => {
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' };
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 200);
      
      // Upload to Supabase storage
      const uploadOptions: UploadOptions = {
        contentCategory: 'story'
      };
      
      const result = await uploadFileToStorage(
        file,
        session.user.id,
        uploadOptions
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      if (!result.url) {
        throw new Error('No URL returned from storage');
      }
      
      // Create story record
      const isVideo = options.isVideo || file.type.startsWith('video/');
      
      const { error: insertError } = await supabase
        .from('stories')
        .insert([{
          creator_id: session.user.id,
          [isVideo ? 'video_url' : 'media_url']: result.url,
          content_type: isVideo ? 'video' : 'image',
          media_type: isVideo ? 'video' : 'image',
          duration: isVideo ? 30 : 10,
          is_active: true,
          is_public: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }]);
      
      if (insertError) throw insertError;
      
      // Refresh stories list
      await fetchStories();
      
      // Simulate completion
      setUploadProgress(100);
      
      return { 
        success: true,
        url: result.url
      };
    } catch (error: any) {
      console.error('Story upload error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to upload story'
      };
    } finally {
      setIsUploading(false);
    }
  }, [session, fetchStories]);

  // Initial fetch and event listeners
  useEffect(() => {
    fetchStories();
    
    // Listen for story upload events
    const handleStoryUploaded = () => {
      fetchStories();
    };
    
    window.addEventListener('story-uploaded', handleStoryUploaded);
    
    return () => {
      window.removeEventListener('story-uploaded', handleStoryUploaded);
    };
  }, [fetchStories]);

  return {
    stories,
    creatorStories,
    loading,
    error,
    uploadStory,
    isUploading,
    uploadProgress,
    refreshStories
  };
};
