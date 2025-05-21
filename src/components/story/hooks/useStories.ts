
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';

interface Story {
  id: string;
  creator_id: string;
  media_url: string;
  content_type: string;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Load stories
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setStories(data || []);
    } catch (error: any) {
      console.error('Error fetching stories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload a new story
  const uploadStory = async (file: File) => {
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload stories',
        variant: 'destructive',
      });
      return null;
    }
    
    setUploading(true);
    
    try {
      // Upload media file
      const result = await uploadMediaToSupabase(
        file, 
        'stories',
        {
          maxSizeMB: 50,
          folder: 'stories'
        }
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      // Create story entry in database
      const contentType = file.type.startsWith('image/') ? 'image' : 'video';
      
      const { data, error } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_url: result.url,
          content_type: contentType,
          is_public: true
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add new story to list
      setStories(prev => [data, ...prev]);
      
      toast({
        title: 'Story uploaded',
        description: 'Your story has been published',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error uploading story:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload story',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    stories,
    loading,
    uploading,
    fetchStories,
    uploadStory
  };
};
