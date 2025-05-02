
import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SurveillanceContentItem, ContentType } from "@/types/surveillance";
import { FileText, Clock, Video, Music, File } from "lucide-react";
import React from "react";

export interface ContentIcon {
  icon: React.ReactNode;
  className: string;
}

export function useContentSurveillance() {
  const [posts, setPosts] = useState<SurveillanceContentItem[]>([]);
  const [stories, setStories] = useState<SurveillanceContentItem[]>([]);
  const [videos, setVideos] = useState<SurveillanceContentItem[]>([]);
  const [audios, setAudios] = useState<SurveillanceContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();
  
  const getIconForContentType = (type: string): ContentIcon => {
    const normalizedType = type.toLowerCase();
    
    if (normalizedType === 'post' || normalizedType === 'posts') {
      return { icon: <FileText className="h-4 w-4" />, className: "h-4 w-4" };
    }
    
    if (normalizedType === 'story' || normalizedType === 'stories') {
      return { icon: <Clock className="h-4 w-4" />, className: "h-4 w-4" };
    }
    
    if (normalizedType === 'video' || normalizedType === 'videos') {
      return { icon: <Video className="h-4 w-4" />, className: "h-4 w-4" };
    }
    
    if (normalizedType === 'audio' || normalizedType === 'audios') {
      return { icon: <Music className="h-4 w-4" />, className: "h-4 w-4" };
    }
    
    return { icon: <File className="h-4 w-4" />, className: "h-4 w-4" };
  };

  const fetchContentItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, creator:creator_id(username, avatar_url)')
        .limit(50);
        
      if (postsError) {
        throw postsError;
      }
      
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*, creator:creator_id(username, avatar_url)')
        .limit(50);
        
      if (storiesError) {
        throw storiesError;
      }
      
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*, creator:creator_id(username, avatar_url)')
        .limit(50);
        
      if (videosError) {
        throw videosError;
      }
      
      const { data: audiosData, error: audiosError } = await supabase
        .from('audios')
        .select('*, creator:creator_id(username, avatar_url)')
        .limit(50);
        
      if (audiosError) {
        throw audiosError;
      }
      
      const transformedPosts: SurveillanceContentItem[] = (postsData || []).map(post => ({
        id: post.id,
        content_type: "post",
        user_id: post.creator_id, // Set user_id to creator_id
        creator_id: post.creator_id,
        created_at: post.created_at,
        media_url: post.media_url || [],
        username: post.creator?.username || "Unknown",
        creator_username: post.creator?.username || "Unknown",
        avatar_url: post.creator?.avatar_url,
        creator_avatar_url: post.creator?.avatar_url,
        content: post.content || "",
        title: post.title || "",
        description: post.description || "",
        visibility: post.visibility || "public",
        is_draft: post.is_draft || false,
        location: post.location || "",
        tags: post.tags || [],
        views: post.views || 0,
        likes: post.likes || 0,
        comments: post.comments || 0,
        is_ppv: post.is_ppv || false,
        ppv_amount: post.ppv_amount,
        status: post.status || "active"
      }));
      
      const transformedStories: SurveillanceContentItem[] = (storiesData || []).map(story => ({
        id: story.id,
        content_type: "story",
        user_id: story.creator_id, // Set user_id to creator_id
        creator_id: story.creator_id,
        created_at: story.created_at,
        media_url: story.media_url || [],
        username: story.creator?.username || "Unknown",
        creator_username: story.creator?.username || "Unknown",
        avatar_url: story.creator?.avatar_url,
        creator_avatar_url: story.creator?.avatar_url,
        content: story.content || "",
        title: story.title || "",
        description: story.description || "",
        visibility: "public",
        location: story.location || "",
        tags: story.tags || [],
        views: story.views || 0,
        likes: story.likes || 0,
        comments: story.comments || 0,
        status: story.status || "active"
      }));
      
      const transformedVideos: SurveillanceContentItem[] = (videosData || []).map(video => ({
        id: video.id,
        content_type: "video",
        user_id: video.creator_id, // Set user_id to creator_id
        creator_id: video.creator_id,
        created_at: video.created_at,
        media_url: video.media_url || [],
        username: video.creator?.username || "Unknown",
        creator_username: video.creator?.username || "Unknown",
        avatar_url: video.creator?.avatar_url,
        creator_avatar_url: video.creator?.avatar_url,
        content: video.content || "",
        title: video.title || "",
        description: video.description || "",
        visibility: video.visibility || "public",
        location: video.location || "",
        tags: video.tags || [],
        views: video.views || 0,
        likes: video.likes || 0,
        comments: video.comments || 0,
        status: video.status || "active"
      }));
      
      const transformedAudios: SurveillanceContentItem[] = (audiosData || []).map(audio => ({
        id: audio.id,
        content_type: "audio",
        user_id: audio.creator_id, // Set user_id to creator_id
        creator_id: audio.creator_id,
        created_at: audio.created_at,
        media_url: audio.media_url || [],
        username: audio.creator?.username || "Unknown",
        creator_username: audio.creator?.username || "Unknown",
        avatar_url: audio.creator?.avatar_url,
        creator_avatar_url: audio.creator?.avatar_url,
        content: audio.content || "",
        title: audio.title || "",
        description: audio.description || "",
        visibility: "public",
        location: audio.location || "",
        tags: audio.tags || [],
        views: audio.views || 0,
        likes: audio.likes || 0,
        comments: audio.comments || 0,
        status: audio.status || "active"
      }));
      
      setPosts(transformedPosts);
      setStories(transformedStories);
      setVideos(transformedVideos);
      setAudios(transformedAudios);
    } catch (error: any) {
      setError(error);
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);
  
  useEffect(() => {
    fetchContentItems();
  }, [fetchContentItems]);

  const filterContentByType = useCallback((items: SurveillanceContentItem[], type: ContentType | string) => {
    return items.filter(item => {
      const normalizedType = item.content_type?.toLowerCase();
      
      if (type === 'post' && normalizedType === 'post') {
        return true;
      }
      
      if (type === 'story' && normalizedType === 'story') {
        return true;
      }
      
      if (type === 'video' && (normalizedType === 'video' || normalizedType === 'media')) {
        return true;
      }
      
      if (type === 'audio' && normalizedType === 'audio') {
        return true;
      }
      
      return false;
    });
  }, []);

  return {
    posts,
    stories,
    videos,
    audios,
    isLoading,
    error,
    getIconForContentType
  };
}
