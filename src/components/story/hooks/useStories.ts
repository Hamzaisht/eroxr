import { useState, useCallback, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/integrations/supabase/types/story';
import { createUniqueFilePath } from '@/utils/media/mediaUtils';

interface UseStoriesResult {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
  uploadStory: (file: File) => Promise<{ success: boolean; error?: string }>;
}

export const useStories = (): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();

  const loadStories = useCallback(async () => {
    try {
      console.log('Loading stories...');
      const { data, error: queryError } = await supabase
        .from('stories')
        .select(`
          *,
          creator:profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      console.log("Fetched stories:", data);
      setStories(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading stories:', err);
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

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const uploadStory = useCallback(async (file: File) => {
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Determine media type based on file type
      const isVideo = file.type.startsWith('video/');
      
      // Create unique storage path
      const path = createUniqueFilePath(session.user.id, file);
      
      console.log('Uploading story:', {
        isVideo,
        fileType: file.type,
        path
      });
      
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(path, file, {
          contentType: file.type,
          upsert: true
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(uploadError.message);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(uploadData.path);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL for story media');
      }
      
      // Create story entry in database
      const { error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_url: isVideo ? null : publicUrl,
          video_url: isVideo ? publicUrl : null,
          content_type: isVideo ? 'video' : 'image',
          media_type: isVideo ? 'video' : 'image',
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      
      if (dbError) {
        throw new Error(dbError.message);
      }
      
      console.log('Story uploaded successfully:', {
        isVideo,
        publicUrl
      });
      
      // Refresh stories list
      await loadStories();
      
      return { success: true };
    } catch (error: any) {
      console.error('Story upload error:', error);
      return { success: false, error: error.message };
    }
  }, [session, loadStories]);

  return {
    stories,
    isLoading,
    error,
    refreshStories: loadStories,
    uploadStory
  };
};
