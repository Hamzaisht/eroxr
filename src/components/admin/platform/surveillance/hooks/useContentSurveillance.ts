
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { SurveillanceContentItem } from "../types";
import { ContentType } from "../types";

export function useContentSurveillance() {
  const [posts, setPosts] = useState<SurveillanceContentItem[]>([]);
  const [stories, setStories] = useState<SurveillanceContentItem[]>([]);
  const [videos, setVideos] = useState<SurveillanceContentItem[]>([]);
  const [audios, setAudios] = useState<SurveillanceContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  
  // Fetch posts
  const fetchPosts = useCallback(async (): Promise<SurveillanceContentItem[]> => {
    if (!session?.user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map(post => ({
        id: post.id,
        content_type: "post",
        type: "bodycontact" as const, // Set a valid type for LiveSession compatibility
        creator_id: post.creator_id,
        username: post.profiles?.[0]?.username || "Unknown",
        avatar_url: post.profiles?.[0]?.avatar_url || null,
        created_at: post.created_at,
        title: post.title || "",
        description: post.description || "",
        media_url: post.media_url || [],
        visibility: post.visibility,
        is_ppv: post.is_ppv,
        ppv_amount: post.ppv_amount,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        view_count: post.view_count,
        is_draft: false,
        is_deleted: false,
        tags: post.tags || []
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  // Fetch stories
  const fetchStories = useCallback(async (): Promise<SurveillanceContentItem[]> => {
    if (!session?.user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map(story => ({
        id: story.id,
        content_type: "story",
        type: "bodycontact" as const, // Set a valid type for LiveSession compatibility
        creator_id: story.creator_id,
        username: story.profiles?.[0]?.username || "Unknown",
        avatar_url: story.profiles?.[0]?.avatar_url || null,
        created_at: story.created_at,
        title: "Story",
        description: "User story content",
        media_url: [story.media_url || ""],
        video_url: story.video_url,
        visibility: "public",
        is_ppv: false,
        is_active: story.is_active,
        duration: story.duration,
        status: story.is_active ? "active" : "expired",
        expires_at: story.expires_at
      }));
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  // Fetch videos
  const fetchVideos = useCallback(async (): Promise<SurveillanceContentItem[]> => {
    if (!session?.user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map(video => ({
        id: video.id,
        content_type: "video",
        type: "bodycontact" as const, // Set a valid type for LiveSession compatibility
        creator_id: video.creator_id,
        username: video.profiles?.[0]?.username || "Unknown",
        avatar_url: video.profiles?.[0]?.avatar_url || null,
        created_at: video.created_at,
        title: video.title,
        description: video.description,
        media_url: [video.thumbnail_url || ""],
        video_url: video.video_url,
        visibility: video.visibility,
        is_ppv: Boolean(video.ppv_amount),
        ppv_amount: video.ppv_amount,
        likes_count: video.like_count,
        comments_count: video.comment_count,
        view_count: video.view_count,
        duration: video.duration,
        is_active: video.is_processed,
        tags: video.tags
      }));
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  // Fetch PPV content 
  const fetchPPVContent = useCallback(async (): Promise<SurveillanceContentItem[]> => {
    if (!session?.user?.id) return [];
    
    try {
      // First get PPV posts
      const { data: ppvPosts, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .eq('is_ppv', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (postsError) throw postsError;
      
      // Then get PPV videos
      const { data: ppvVideos, error: videosError } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .not('ppv_amount', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (videosError) throw videosError;
      
      // Map and combine the results
      const ppvPostItems = (ppvPosts || []).map(post => ({
        id: post.id,
        content_type: "post",
        type: "bodycontact" as const, // Set a valid type for LiveSession compatibility
        creator_id: post.creator_id,
        username: post.profiles?.[0]?.username || "Unknown",
        avatar_url: post.profiles?.[0]?.avatar_url || null,
        created_at: post.created_at,
        title: post.title || "Paid Content",
        description: post.content,
        media_url: post.media_url || [],
        video_urls: post.video_urls,
        visibility: post.visibility,
        is_ppv: true,
        ppv_amount: post.ppv_amount,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        view_count: post.view_count,
        status: 'active',
        tags: post.tags
      }));
      
      const ppvVideoItems = (ppvVideos || []).map(video => ({
        id: video.id,
        content_type: "video",
        type: "bodycontact" as const, // Set a valid type for LiveSession compatibility
        creator_id: video.creator_id,
        username: video.profiles?.[0]?.username || "Unknown",
        avatar_url: video.profiles?.[0]?.avatar_url || null,
        created_at: video.created_at,
        title: video.title,
        description: video.description,
        media_url: [video.thumbnail_url || ""],
        video_url: video.video_url,
        visibility: video.visibility,
        is_ppv: true,
        ppv_amount: video.ppv_amount,
        likes_count: video.like_count,
        comments_count: video.comment_count,
        view_count: video.view_count,
        duration: video.duration,
        tags: video.tags
      }));
      
      return [...ppvPostItems, ...ppvVideoItems];
    } catch (error) {
      console.error("Error fetching PPV content:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  // Fetch audio content
  const fetchAudio = useCallback(async (): Promise<SurveillanceContentItem[]> => {
    if (!session?.user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('sounds')
        .select(`
          *,
          profiles:creator_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map(sound => ({
        id: sound.id,
        content_type: "audio",
        type: "chat" as const, // Set a valid type for LiveSession compatibility
        creator_id: sound.creator_id,
        username: sound.profiles?.[0]?.username || "Unknown",
        avatar_url: sound.profiles?.[0]?.avatar_url || null,
        created_at: sound.created_at,
        title: sound.title,
        description: "Audio content",
        media_url: [],
        audio_url: sound.audio_url,
        duration: sound.duration,
        visibility: "public",
        is_ppv: false,
        use_count: sound.use_count,
        is_draft: false,
        is_deleted: false
      }));
    } catch (error) {
      console.error("Error fetching audio:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  // Fetch all content types
  const fetchAllContent = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const [postsData, storiesData, videosData, audioData] = await Promise.all([
        fetchPosts(),
        fetchStories(),
        fetchVideos(),
        fetchAudio()
      ]);
      
      setPosts(postsData);
      setStories(storiesData);
      setVideos(videosData);
      setAudios(audioData);
      
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Could not load content surveillance data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, fetchStories, fetchVideos, fetchAudio, toast]);
  
  // Fetch content by specific type
  const fetchContentByType = useCallback(async (contentType: ContentType): Promise<SurveillanceContentItem[]> => {
    setIsLoading(true);
    try {
      switch (contentType) {
        case 'post':
          return await fetchPosts();
        case 'story':
          return await fetchStories();
        case 'video':
          return await fetchVideos();
        case 'ppv':
          return await fetchPPVContent();
        case 'audio':
          return await fetchAudio();
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error fetching ${contentType} content:`, error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, fetchStories, fetchVideos, fetchPPVContent, fetchAudio]);
  
  return {
    posts,
    stories,
    videos,
    audios,
    isLoading,
    fetchAllContent,
    fetchContentByType
  };
}
