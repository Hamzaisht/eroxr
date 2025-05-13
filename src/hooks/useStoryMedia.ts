
import { useState, useCallback, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { MediaOptions } from '@/utils/media/types';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';

interface UseStoryMediaOptions extends MediaOptions {
  onComplete?: () => void;
  // MediaOptions now includes onError, so it's compatible
}

export const useStoryMedia = (
  mediaUrl?: string | null, 
  mediaType: 'image' | 'video' = 'image',
  isPaused: boolean = false,
  options?: UseStoryMediaOptions
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const session = useSession();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!mediaUrl) {
      setIsLoading(false);
      setHasError(true);
      setError("No media URL provided");
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      const processedUrl = getPlayableMediaUrl(mediaUrl);
      setUrl(processedUrl);
    } catch (err: any) {
      console.error("Error processing media URL:", err);
      setError(err.message || "Failed to process media URL");
      setHasError(true);
    }
  }, [mediaUrl, retryCount]);
  
  const handleLoad = useCallback(() => {
    console.log('Story media loaded successfully');
    setIsLoading(false);
    
    if (options?.onComplete && mediaType === 'image') {
      options.onComplete();
    }
  }, [mediaType, options]);
  
  const handleError = useCallback(() => {
    console.error('Failed to load story media:', mediaUrl);
    setIsLoading(false);
    setHasError(true);
    setError("Failed to load media");
    
    if (options?.onError) {
      options.onError();
    }
  }, [mediaUrl, options]);
  
  const retryLoad = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);
  
  const uploadMedia = useCallback(async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = `https://example.com/stories/${Date.now()}_${file.name}`;
      
      setUrl(url);
      setIsLoading(false);
      
      return { success: true, url };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload media';
      setError(errorMessage);
      setIsLoading(false);
      setHasError(true);
      
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
    hasError,
    mediaUrl: url,
    url,
    handleLoad,
    handleError,
    retryLoad,
    uploadMedia,
  };
};
