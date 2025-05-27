
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useAvatarUpload = () => {
  const [state, setState] = useState<AvatarUploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });
  
  const session = useSession();
  const { toast } = useToast();

  const uploadAvatar = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user?.id) {
      const error = "You must be logged in to upload an avatar";
      setState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    if (!file.type.startsWith('image/')) {
      const error = "Please upload an image file";
      setState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    if (file.size > 5 * 1024 * 1024) {
      const error = "Image must be smaller than 5MB";
      setState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    setState({
      isUploading: true,
      progress: 0,
      error: null
    });

    try {
      // Create file path: avatars/{userId}-{timestamp}.{extension}
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `avatars/${session.user.id}-${timestamp}.${fileExt}`;

      // Simulate progress
      setState(prev => ({ ...prev, progress: 25 }));

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setState(prev => ({ ...prev, progress: 75 }));

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      // Deactivate old avatars by updating their metadata
      await supabase
        .from('media_assets')
        .update({ 
          metadata: { usage: 'avatar_old' },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id)
        .eq('metadata->usage', 'avatar');

      // Create media asset record
      const { error: assetError } = await supabase
        .from('media_assets')
        .insert({
          user_id: session.user.id,
          storage_path: uploadData.path,
          original_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          media_type: 'image',
          access_level: 'private',
          metadata: { usage: 'avatar' }
        });

      if (assetError) {
        // Clean up uploaded file if asset creation fails
        await supabase.storage.from('media').remove([uploadData.path]);
        throw new Error(assetError.message);
      }

      setState({
        isUploading: false,
        progress: 100,
        error: null
      });

      toast({
        title: "Success",
        description: "Avatar updated successfully"
      });

      return { success: true };
    } catch (error: any) {
      setState({
        isUploading: false,
        progress: 0,
        error: error.message
      });

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });

      return { success: false, error: error.message };
    }
  };

  return {
    uploadAvatar,
    ...state
  };
};
