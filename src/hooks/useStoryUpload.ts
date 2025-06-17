
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useStoriesFeed } from '@/hooks/useStoriesFeed';
import { supabase } from '@/integrations/supabase/client';

export const useStoryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { refetch } = useStoriesFeed();

  const uploadStory = async (file: File, duration: number = 10, caption?: string) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to upload stories',
        variant: 'destructive',
      });
      return { success: false, error: 'Authentication required' };
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate file
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 100MB');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please use JPEG, PNG, GIF, WebP, MP4, or WebM files.');
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Generate clean filename
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const fileName = `${user.id}-${Date.now()}.${fileExtension}`;

      console.log('Uploading story file:', fileName, 'Size:', file.size, 'Type:', file.type, 'Duration:', duration);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(uploadData.path);

      console.log('Generated public URL:', publicUrl);

      // Validate the public URL
      if (!publicUrl || publicUrl.includes('undefined')) {
        throw new Error('Failed to generate valid public URL');
      }

      // Create story record with duration
      const storyData = {
        creator_id: user.id,
        content_type: file.type.startsWith('video/') ? 'video' : 'image',
        duration: duration, // Store the selected duration
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      };

      // Assign URL to correct field based on content type
      if (file.type.startsWith('video/')) {
        (storyData as any).video_url = publicUrl;
        (storyData as any).media_url = null;
      } else {
        (storyData as any).media_url = publicUrl;
        (storyData as any).video_url = null;
      }

      const { data: dbData, error: dbError } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('stories').remove([uploadData.path]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Story created successfully:', dbData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Story uploaded',
        description: `Your ${duration}-second story has been shared successfully!`,
      });

      // Refresh stories feed
      await refetch();

      return { success: true, data: dbData };
    } catch (error: any) {
      console.error('Story upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload story',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadStory,
    uploading,
    uploadProgress,
  };
};
