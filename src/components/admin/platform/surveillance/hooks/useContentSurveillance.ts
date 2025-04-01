
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentType, SurveillanceContentItem } from "../types";

export function useContentSurveillance() {
  const [posts, setPosts] = useState<SurveillanceContentItem[]>([]);
  const [stories, setStories] = useState<SurveillanceContentItem[]>([]);
  const [videos, setVideos] = useState<SurveillanceContentItem[]>([]);
  const [ppvContent, setPpvContent] = useState<SurveillanceContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          creator_id,
          content,
          media_url,
          video_urls,
          created_at,
          updated_at,
          visibility,
          is_ppv,
          ppv_amount,
          creator:profiles!posts_creator_id_fkey (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedPosts: SurveillanceContentItem[] = (data || []).map(post => ({
        id: post.id,
        content_type: 'post',
        creator_id: post.creator_id,
        creator_username: post.creator?.username || 'Unknown',
        creator_avatar_url: post.creator?.avatar_url || '',
        content: post.content,
        media_urls: [
          ...(post.media_url || []),
          ...(post.video_urls || [])
        ],
        created_at: post.created_at,
        updated_at: post.updated_at,
        is_ppv: post.is_ppv || false,
        is_draft: false,
        is_deleted: false,
        visibility: post.visibility,
        ppv_amount: post.ppv_amount
      }));
      
      setPosts(formattedPosts);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id,
          creator_id,
          media_url,
          video_url,
          created_at,
          expires_at,
          is_active,
          screenshot_disabled,
          creator:profiles!stories_creator_id_fkey (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedStories: SurveillanceContentItem[] = (data || []).map(story => ({
        id: story.id,
        content_type: 'story',
        creator_id: story.creator_id,
        creator_username: story.creator?.username || 'Unknown',
        creator_avatar_url: story.creator?.avatar_url || '',
        content: 'Story Content',
        media_urls: [
          ...(story.media_url ? [story.media_url] : []),
          ...(story.video_url ? [story.video_url] : [])
        ],
        created_at: story.created_at,
        updated_at: null,
        is_ppv: false,
        is_draft: false,
        is_deleted: !story.is_active,
        visibility: 'public',
        expires_at: story.expires_at
      }));
      
      setStories(formattedStories);
    } catch (err: any) {
      console.error("Error fetching stories:", err);
      setError(err.message || "Failed to fetch stories");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("videos")
        .select(`
          id,
          creator_id,
          title,
          description,
          video_url,
          thumbnail_url,
          created_at,
          updated_at,
          visibility,
          is_processed,
          ppv_amount,
          creator:profiles!videos_creator_id_fkey (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedVideos: SurveillanceContentItem[] = (data || []).map(video => ({
        id: video.id,
        content_type: 'video',
        creator_id: video.creator_id,
        creator_username: video.creator?.username || 'Unknown',
        creator_avatar_url: video.creator?.avatar_url || '',
        content: `${video.title}\n\n${video.description || ''}`,
        media_urls: [
          ...(video.video_url ? [video.video_url] : []),
          ...(video.thumbnail_url ? [video.thumbnail_url] : [])
        ],
        created_at: video.created_at,
        updated_at: video.updated_at,
        is_ppv: !!video.ppv_amount,
        is_draft: !video.is_processed,
        is_deleted: false,
        visibility: video.visibility,
        ppv_amount: video.ppv_amount
      }));
      
      setVideos(formattedVideos);
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Failed to fetch videos");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPpvContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          creator_id,
          content,
          media_url,
          video_urls,
          created_at,
          updated_at,
          visibility,
          is_ppv,
          ppv_amount,
          creator:profiles!posts_creator_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('is_ppv', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedPpvContent: SurveillanceContentItem[] = (data || []).map(post => ({
        id: post.id,
        content_type: 'ppv',
        creator_id: post.creator_id,
        creator_username: post.creator?.username || 'Unknown',
        creator_avatar_url: post.creator?.avatar_url || '',
        content: post.content,
        media_urls: [
          ...(post.media_url || []),
          ...(post.video_urls || [])
        ],
        created_at: post.created_at,
        updated_at: post.updated_at,
        is_ppv: true,
        is_draft: false,
        is_deleted: false,
        visibility: post.visibility,
        ppv_amount: post.ppv_amount
      }));
      
      setPpvContent(formattedPpvContent);
    } catch (err: any) {
      console.error("Error fetching PPV content:", err);
      setError(err.message || "Failed to fetch PPV content");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentByType = useCallback((type: ContentType) => {
    switch (type) {
      case 'post':
        fetchPosts();
        break;
      case 'story':
        fetchStories();
        break;
      case 'video':
        fetchVideos();
        break;
      case 'ppv':
        fetchPpvContent();
        break;
      default:
        break;
    }
  }, []);

  const fetchAllContent = useCallback(async () => {
    try {
      setIsLoading(true);
      
      await Promise.all([
        fetchPosts(),
        fetchStories(),
        fetchVideos(),
        fetchPpvContent()
      ]);
    } catch (err) {
      console.error("Error fetching all content:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    posts,
    stories,
    videos,
    ppvContent,
    isLoading,
    error,
    fetchContentByType,
    fetchAllContent
  };
}
