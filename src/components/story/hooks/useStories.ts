
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Story } from "@/integrations/supabase/types/story";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setError(null);
        console.info('Fetching stories');
        
        const { data: subscriptions, error: subsError } = await supabase
          .from('creator_subscriptions')
          .select('creator_id')
          .eq('user_id', session?.user?.id);

        if (subsError) throw subsError;

        const { data: following, error: followError } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', session?.user?.id);

        if (followError) throw followError;

        const creatorIds = [
          ...(subscriptions?.map(sub => sub.creator_id) || []),
          ...(following?.map(f => f.following_id) || [])
        ];

        if (session?.user?.id) {
          creatorIds.push(session.user.id);
        }

        const uniqueCreatorIds = [...new Set(creatorIds)];

        if (uniqueCreatorIds.length === 0) {
          setStories([]);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('stories')
          .select(`
            *,
            creator:profiles!stories_creator_id_fkey(
              id,
              username,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .in('creator_id', uniqueCreatorIds)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const validStories = data?.filter(story => 
          (story.media_url || story.video_url) && story.creator
        ) || [];

        setStories(validStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setError('Failed to load stories');
        toast({
          title: "Error loading stories",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchStories();
    }
  }, [session?.user?.id, toast]);

  return { stories, isLoading, error, setStories };
};
