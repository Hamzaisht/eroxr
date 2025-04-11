
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/integrations/supabase/types/story';
import { uploadFileToStorage, getUrlWithCacheBuster } from '@/utils/mediaUtils';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [creatorStories, setCreatorStories] = useState<Record<string, Story[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Fetch all stories
  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          creator:profiles(
            id, 
            username, 
            full_name, 
            avatar_url, 
            is_verified,
            is_paying_customer
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the stories
      const processedStories = data.map(story => ({
        ...story,
        media_url: story.media_url ? getUrlWithCacheBuster(story.media_url) : null,
        video_url: story.video_url ? getUrlWithCacheBuster(story.video_url) : null
      }));
      
      setStories(processedStories);
      
      // Group stories by creator
      const storiesByCreator: Record<string, Story[]> = {};
      processedStories.forEach(story => {
        const creatorId = story.creator_id;
        if (!storiesByCreator[creatorId]) {
          storiesByCreator[creatorId] = [];
        }
        storiesByCreator[creatorId].push(story);
      });
      
      setCreatorStories(storiesByCreator);
    } catch (err: any) {
      console.error('Error fetching stories:', err);
      setError(err.message || 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload a new story
  const uploadStory = async (file: File, options?: { isVideo?: boolean }) => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to upload stories',
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 300);
      
      // Upload the file to storage
      const contentCategory = 'story';
      const result = await uploadFileToStorage(
        file,
        contentCategory,
        session.user.id
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload file');
      }
      
      // Determine whether it's a video or image
      const isVideo = options?.isVideo || file.type.startsWith('video/');
      
      // Add the story to the database
      const { data, error } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          [isVideo ? 'video_url' : 'media_url']: result.url,
          content_type: isVideo ? 'video' : 'image',
          media_type: isVideo ? 'video' : 'image',
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        })
        .select();
      
      if (error) throw error;
      
      // Update progress
      setUploadProgress(100);
      
      toast({
        title: 'Story uploaded successfully',
        description: 'Your story is now visible to your followers',
      });
      
      // Refetch stories
      fetchStories();
      
      return { success: true, data: data[0] };
    } catch (err: any) {
      console.error('Error uploading story:', err);
      
      toast({
        title: 'Upload failed',
        description: err.message || 'There was a problem uploading your story',
        variant: 'destructive',
      });
      
      return { success: false, error: err.message || 'Failed to upload story' };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return {
    stories,
    creatorStories,
    loading,
    error,
    uploadStory,
    isUploading,
    uploadProgress,
    refreshStories: fetchStories
  };
};
