
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { MediaOptions } from '@/utils/media/types';

export const useStoryMedia = (options?: MediaOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  const uploadMedia = useCallback(async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate upload - replace with actual upload code
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = `https://example.com/stories/${Date.now()}_${file.name}`;
      
      setMediaUrl(url);
      setIsLoading(false);
      
      return { success: true, url };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload media';
      setError(errorMessage);
      setIsLoading(false);
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    }
  }, [session, toast]);
  
  return {
    isLoading,
    error,
    mediaUrl,
    uploadMedia,
  };
};
