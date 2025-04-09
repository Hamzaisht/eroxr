
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
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Process stories to ensure proper URLs and types
        const processedStories: Story[] = [];
        
        for (let i = 0; i < data.length; i++) {
          const storyData = data[i];
          
          // Skip invalid story data
          if (!storyData || typeof storyData !== 'object') {
            console.warn("Invalid story data encountered:", storyData);
            continue;
          }
          
          // Create a story object with proper typing - use null assertion to handle null checks
          const story: Story = {
            id: storyData.id || '',
            creator_id: storyData.creator_id || '',
            media_url: storyData.media_url || null,
            video_url: storyData.video_url || null,
            duration: storyData.duration || null,
            created_at: storyData.created_at || new Date().toISOString(),
            expires_at: storyData.expires_at || new Date().toISOString(),
            is_active: storyData.is_active ?? true,
            screenshot_disabled: storyData.screenshot_disabled ?? true,
            content_type: storyData.content_type || 'image',
            media_type: storyData.media_type || null,
            creator: storyData.creator || { id: '', username: 'Unknown', avatar_url: null }
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
            } else {
              story.media_type = 'image'; // Default fallback
            }
          } else if (!story.media_type && story.content_type) {
            story.media_type = story.content_type;
          }
          
          processedStories.push(story);
        }
        
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
