
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { runFileDiagnostic } from '@/utils/upload/fileUtils';

export const useStorageService = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  const uploadVideoToStorage = async (userId: string, file: File): Promise<{ path: string | null; error: string | null }> => {
    if (!file) {
      return { path: null, error: 'No file provided' };
    }

    setIsUploading(true);
    setError(null);

    try {
      // Run file diagnostics
      const diagnostic = runFileDiagnostic(file);
      if (!diagnostic.valid) {
        throw new Error(diagnostic.error);
      }

      // Create a unique filename based on user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('shorts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      return { path: data?.path || null, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload video';
      setError(errorMessage);
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { path: null, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadVideoToStorage,
    isUploading,
    error
  };
};
