
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/integrations/supabase/types/story';

interface UseStoriesResult {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
}

export const useStories = (): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
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

  const refreshStories = useCallback(async () => {
    await loadStories();
  }, [loadStories]);

  return {
    stories,
    isLoading,
    error,
    refreshStories
  };
};
