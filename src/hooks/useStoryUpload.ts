
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStoryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();

  const uploadStory = async (file: File, caption?: string) => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload a story.',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `stories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 50); // 50% for upload
          },
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setUploadProgress(75);

      // Create story record
      const contentType = file.type.startsWith('video/') ? 'video' : 'image';
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const storyData = {
        creator_id: session.user.id,
        content_type: contentType,
        is_active: true,
        expires_at: expiresAt.toISOString(),
        ...(contentType === 'video' ? { video_url: publicUrl } : { media_url: publicUrl }),
      };

      const { data, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single();

      if (error) throw error;

      setUploadProgress(100);

      toast({
        title: 'Story uploaded',
        description: 'Your story has been published successfully!',
      });

      return data;
    } catch (error) {
      console.error('Error uploading story:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload your story. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadStory,
    uploading,
    uploadProgress,
  };
};
