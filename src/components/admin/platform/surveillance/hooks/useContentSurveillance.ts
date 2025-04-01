
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentType, SurveillanceContentItem } from "../types";

export function useContentSurveillance() {
  const [posts, setPosts] = useState<SurveillanceContentItem[]>([]);
  const [stories, setStories] = useState<SurveillanceContentItem[]>([]);
  const [videos, setVideos] = useState<SurveillanceContentItem[]>([]);
  const [ppvContent, setPpvContent] = useState<SurveillanceContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  const fetchContentByType = useCallback(async (contentType: ContentType) => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      switch (contentType) {
        case 'post': {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              id,
              creator_id,
              content,
              media_url,
              created_at,
              updated_at,
              is_ppv,
              ppv_amount,
              visibility,
              profiles(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedPosts: SurveillanceContentItem[] = data.map(post => ({
            id: post.id,
            content_type: 'post',
            creator_id: post.creator_id,
            creator_username: post.profiles ? post.profiles.username : 'Unknown',
            creator_avatar_url: post.profiles ? post.profiles.avatar_url : null,
            content: post.content || '',
            media_urls: post.media_url || [],
            created_at: post.created_at,
            updated_at: post.updated_at,
            is_ppv: post.is_ppv || false,
            is_draft: false,
            is_deleted: false,
            visibility: post.visibility || 'public',
            ppv_amount: post.ppv_amount
          }));
          
          setPosts(formattedPosts);
          break;
        }
          
        case 'story': {
          const { data, error } = await supabase
            .from('stories')
            .select(`
              id,
              creator_id,
              media_url,
              video_url,
              created_at,
              expires_at,
              is_active,
              profiles(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedStories: SurveillanceContentItem[] = data.map(story => ({
            id: story.id,
            content_type: 'story',
            creator_id: story.creator_id,
            creator_username: story.profiles ? story.profiles.username : 'Unknown',
            creator_avatar_url: story.profiles ? story.profiles.avatar_url : null,
            content: '',
            media_urls: story.media_url ? [story.media_url] : [],
            created_at: story.created_at,
            updated_at: null,
            is_ppv: false,
            is_draft: false,
            is_deleted: !story.is_active,
            visibility: 'public',
            expires_at: story.expires_at
          }));
          
          setStories(formattedStories);
          break;
        }
          
        case 'video': {
          const { data, error } = await supabase
            .from('videos')
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
              ppv_amount,
              profiles(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedVideos: SurveillanceContentItem[] = data.map(video => ({
            id: video.id,
            content_type: 'video',
            creator_id: video.creator_id,
            creator_username: video.profiles ? video.profiles.username : 'Unknown',
            creator_avatar_url: video.profiles ? video.profiles.avatar_url : null,
            content: video.description || video.title || '',
            media_urls: video.thumbnail_url ? [video.thumbnail_url] : [],
            created_at: video.created_at,
            updated_at: video.updated_at,
            is_ppv: !!video.ppv_amount,
            is_draft: false,
            is_deleted: false,
            visibility: video.visibility || 'public',
            ppv_amount: video.ppv_amount
          }));
          
          setVideos(formattedVideos);
          break;
        }
          
        case 'ppv': {
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select(`
              id,
              creator_id,
              content,
              media_url,
              created_at,
              updated_at,
              ppv_amount,
              visibility,
              profiles(username, avatar_url)
            `)
            .eq('is_ppv', true)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (postsError) throw postsError;
          
          const formattedPpvPosts: SurveillanceContentItem[] = postsData.map(post => ({
            id: post.id,
            content_type: 'post',
            creator_id: post.creator_id,
            creator_username: post.profiles ? post.profiles.username : 'Unknown',
            creator_avatar_url: post.profiles ? post.profiles.avatar_url : null,
            content: post.content || '',
            media_urls: post.media_url || [],
            created_at: post.created_at,
            updated_at: post.updated_at,
            is_ppv: true,
            is_draft: false,
            is_deleted: false,
            visibility: post.visibility || 'public',
            ppv_amount: post.ppv_amount
          }));
          
          setPpvContent(formattedPpvPosts);
          break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      setError(`Failed to load ${contentType} content. Please try again.`);
      
      // Clear the data for the failed content type
      switch (contentType) {
        case 'post':
          setPosts([]);
          break;
        case 'story':
          setStories([]);
          break;
        case 'video':
          setVideos([]);
          break;
        case 'ppv':
          setPpvContent([]);
          break;
      }
      
      toast({
        title: "Error",
        description: `Could not load ${contentType} content`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast]);
  
  return {
    posts,
    stories,
    videos,
    ppvContent,
    isLoading,
    error,
    fetchContentByType
  };
}
