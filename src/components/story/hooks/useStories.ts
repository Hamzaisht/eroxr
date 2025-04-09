
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
        // Process stories to ensure proper URLs and types
        const processedStories = data.map(storyData => {
          // Create a new object with the same properties as storyData
          const story: Story = {
            id: storyData.id,
            creator_id: storyData.creator_id,
            media_url: storyData.media_url,
            video_url: storyData.video_url,
            duration: storyData.duration,
            created_at: storyData.created_at,
            expires_at: storyData.expires_at,
            is_active: storyData.is_active,
            screenshot_disabled: storyData.screenshot_disabled,
            content_type: storyData.content_type,
            media_type: storyData.media_type,
            creator: storyData.creator
          };
          
          // Add cache busters to URLs to prevent caching issues
          if (story.media_url) {
            story.media_url = getUrlWithCacheBuster(story.media_url);
          }
          
          if (story.video_url) {
            story.video_url = getUrlWithCacheBuster(story.video_url);
          }
          
          // Determine media type with fallback logic
          if (!story.media_type && !story.content_type) {
            if (story.video_url) {
              story.media_type = 'video';
            } else if (story.media_url) {
              story.media_type = 'image';
            }
          } else if (!story.media_type && story.content_type) {
            story.media_type = story.content_type;
          }
          
          return story;
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
