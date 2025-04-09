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
        
        // Get creator IDs from subscriptions
        const { data: subscriptions, error: subsError } = await supabase
          .from('creator_subscriptions')
          .select('creator_id')
          .eq('user_id', session?.user?.id);

        if (subsError) {
          console.error("Error fetching subscriptions:", subsError);
          throw subsError;
        }

        // Get creator IDs from following
        const { data: following, error: followError } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', session?.user?.id);

        if (followError) {
          console.error("Error fetching following:", followError);
          throw followError;
        }

        // Combine all creator IDs 
        const creatorIds = [
          ...(subscriptions?.map(sub => sub.creator_id) || []),
          ...(following?.map(f => f.following_id) || [])
        ];

        // Always include user's own stories
        if (session?.user?.id) {
          creatorIds.push(session.user.id);
        }

        // Make unique array of creator IDs
        const uniqueCreatorIds = [...new Set(creatorIds)];
        console.log("Using creator IDs for stories fetch:", uniqueCreatorIds);

        // If no creators to fetch, show empty state
        if (uniqueCreatorIds.length === 0) {
          console.log("No creator IDs found for stories");
          setStories([]);
          setIsLoading(false);
          return;
        }

        // Fetch stories with creator profiles
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
          .eq('is_public', true)
          .in('creator_id', uniqueCreatorIds)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching stories with profiles:", error);
          throw error;
        }

        console.log("Stories data returned:", data);

        // Filter out stories with missing media or creator info
        const validStories = data?.filter(story => {
          const hasMedia = story.media_url || story.video_url;
          const hasCreator = !!story.creator;
          if (!hasMedia) console.log("Story missing media:", story.id);
          if (!hasCreator) console.log("Story missing creator:", story.id);
          
          // Set content_type if it's missing (backwards compatibility)
          if (story && !story.content_type) {
            story.content_type = story.video_url ? 'video' : 'image';
            console.log(`Added missing content_type '${story.content_type}' to story:`, story.id);
          }
          
          return hasMedia && hasCreator;
        }) || [];

        console.log("Valid stories to display:", validStories.length);
        
        if (validStories.length > 0) {
          // Add cache buster to media URLs to prevent stale cache
          const storiesWithCacheBusters = validStories.map(story => {
            const mediaUrl = story.media_url || story.video_url;
            if (mediaUrl) {
              const cacheBuster = mediaUrl.includes('?') 
                ? `${mediaUrl}&cb=${Date.now()}` 
                : `${mediaUrl}?cb=${Date.now()}`;
              return {
                ...story,
                media_url: story.media_url ? cacheBuster : story.media_url,
                video_url: story.video_url ? cacheBuster : story.video_url
              };
            }
            return story;
          });
          
          setStories(storiesWithCacheBusters);
        } else {
          setStories([]);
        }
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
    } else {
      // If not logged in, clear stories and stop loading
      setStories([]);
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);

  return { stories, isLoading, error, setStories };
};
