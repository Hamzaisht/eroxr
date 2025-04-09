
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/integrations/supabase/types/story";
import { useToast } from "@/hooks/use-toast";
import { getUrlWithCacheBuster } from "@/utils/mediaUtils";

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if the media_type column exists
      const { data: columnCheck, error: columnError } = await supabase.rpc(
        "check_column_exists",
        { p_table_name: "stories", p_column_name: "media_type" }
      );
      
      const hasMediaTypeColumn = columnCheck === true;
      
      console.log("Stories table has media_type column:", hasMediaTypeColumn);
      
      // Define the columns to select
      const baseColumns = `
        id, 
        creator_id, 
        media_url,
        video_url, 
        duration, 
        created_at,
        expires_at,
        is_active,
        screenshot_disabled,
        content_type
      `;
      
      const columnsWithMediaType = `
        ${baseColumns},
        media_type
      `;
      
      // Fetch stories with creator info
      const { data, error: fetchError } = await supabase
        .from("stories")
        .select(`
          ${hasMediaTypeColumn ? columnsWithMediaType : baseColumns},
          creator:profiles(id, username, avatar_url)
        `)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        // Process stories to ensure proper URLs
        const processedStories: Story[] = data.map(story => {
          const storyObject: any = {...story}; // Create a copy of the story object
          
          // Add cache busters to URLs to prevent caching issues
          if (storyObject.media_url) {
            storyObject.media_url = getUrlWithCacheBuster(storyObject.media_url);
          }
          
          if (storyObject.video_url) {
            storyObject.video_url = getUrlWithCacheBuster(storyObject.video_url);
          }
          
          // Determine media type with fallback logic
          if (!storyObject.media_type && !storyObject.content_type) {
            if (storyObject.video_url) {
              storyObject.media_type = 'video';
            } else if (storyObject.media_url) {
              storyObject.media_type = 'image';
            }
          } else if (!storyObject.media_type && storyObject.content_type) {
            storyObject.media_type = storyObject.content_type;
          }
          
          return storyObject as Story;
        });
        
        setStories(processedStories);
        console.log("Fetched stories:", processedStories);
      } else {
        console.log("No active stories found");
        setStories([]);
      }
    } catch (err: any) {
      console.error("Error fetching stories:", err);
      setError(err.message || "Failed to load stories");
      toast({
        title: "Failed to load stories",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refetchStories = () => {
    fetchStories();
  };

  useEffect(() => {
    fetchStories();
    
    // Listen for story-uploaded custom event
    const handleStoryUploaded = () => {
      console.log("Story uploaded event detected, refetching stories...");
      fetchStories();
    };
    
    window.addEventListener('story-uploaded', handleStoryUploaded);
    
    return () => {
      window.removeEventListener('story-uploaded', handleStoryUploaded);
    };
  }, []);

  return {
    stories,
    isLoading,
    error,
    refetchStories,
  };
};
