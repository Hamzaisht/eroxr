
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SurveillanceContentItem, ContentType } from "../types";

export function useContentSurveillance() {
  const [posts, setPosts] = useState<SurveillanceContentItem[]>([]);
  const [stories, setStories] = useState<SurveillanceContentItem[]>([]);
  const [videos, setVideos] = useState<SurveillanceContentItem[]>([]);
  const [ppvContent, setPpvContent] = useState<SurveillanceContentItem[]>([]);
  const [audioContent, setAudioContent] = useState<SurveillanceContentItem[]>([]);
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
          // Fetch posts
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              profiles(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedPosts: SurveillanceContentItem[] = data.map(post => {
            // Access the first profile in the array safely
            const profile = post.profiles?.[0];
            
            return {
              id: post.id,
              content_type: 'post',
              creator_id: post.creator_id,
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
              created_at: post.created_at,
              title: post.content?.substring(0, 30) || 'Untitled',
              description: post.content || '',
              media_urls: post.media_url || [],
              visibility: post.visibility || 'public',
              is_ppv: post.is_ppv || false,
              ppv_amount: post.ppv_amount || 0,
              likes_count: post.likes_count || 0,
              comments_count: post.comments_count || 0,
              view_count: post.view_count || 0,
              is_draft: false,
              is_deleted: false,
              tags: post.tags || []
            };
          });
          
          setPosts(formattedPosts);
          break;
        }
        
        case 'story': {
          // Fetch stories (including expired ones)
          const { data, error } = await supabase
            .from('stories')
            .select(`
              *,
              profiles(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedStories: SurveillanceContentItem[] = data.map(story => {
            // Access the first profile in the array safely
            const profile = story.profiles?.[0];
            
            return {
              id: story.id,
              content_type: 'story',
              creator_id: story.creator_id,
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
              created_at: story.created_at,
              title: 'Story',
              description: '',
              media_urls: story.media_url ? [story.media_url] : [],
              video_url: story.video_url || null,
              visibility: 'public',
              is_ppv: false,
              likes_count: 0,
              comments_count: 0,
              view_count: 0,
              is_draft: false,
              is_active: story.is_active,
              is_deleted: !story.is_active,
              expires_at: story.expires_at
            };
          });
          
          setStories(formattedStories);
          break;
        }
        
        case 'video': {
          // Fetch videos
          const { data, error } = await supabase
            .from('videos')
            .select(`
              *,
              profiles(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedVideos: SurveillanceContentItem[] = data.map(video => {
            // Access the first profile in the array safely
            const profile = video.profiles?.[0];
            
            return {
              id: video.id,
              content_type: 'video',
              creator_id: video.creator_id,
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
              created_at: video.created_at,
              title: video.title || 'Untitled Video',
              description: video.description || '',
              media_urls: video.thumbnail_url ? [video.thumbnail_url] : [],
              video_url: video.video_url || null,
              visibility: video.visibility || 'public',
              is_ppv: video.ppv_amount ? true : false,
              ppv_amount: video.ppv_amount || 0,
              likes_count: video.like_count || 0,
              comments_count: video.comment_count || 0,
              view_count: video.view_count || 0,
              is_draft: false,
              is_deleted: false,
              tags: video.tags || []
            };
          });
          
          setVideos(formattedVideos);
          break;
        }
        
        case 'ppv': {
          // Fetch all PPV content (posts and videos)
          const { data: ppvPosts, error: postsError } = await supabase
            .from('posts')
            .select(`
              *,
              profiles(username, avatar_url)
            `)
            .eq('is_ppv', true)
            .order('created_at', { ascending: false })
            .limit(25);
            
          if (postsError) throw postsError;
          
          const { data: ppvVideos, error: videosError } = await supabase
            .from('videos')
            .select(`
              *,
              profiles(username, avatar_url)
            `)
            .not('ppv_amount', 'is', null)
            .order('created_at', { ascending: false })
            .limit(25);
            
          if (videosError) throw videosError;
          
          // Format PPV posts
          const formattedPpvPosts: SurveillanceContentItem[] = ppvPosts.map(post => {
            // Access the first profile in the array safely
            const profile = post.profiles?.[0];
            
            return {
              id: post.id,
              content_type: 'post',
              creator_id: post.creator_id,
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
              created_at: post.created_at,
              title: post.content?.substring(0, 30) || 'Untitled',
              description: post.content || '',
              media_urls: post.media_url || [],
              video_urls: post.video_urls || [],
              visibility: post.visibility || 'public',
              is_ppv: true,
              ppv_amount: post.ppv_amount || 0,
              likes_count: post.likes_count || 0,
              comments_count: post.comments_count || 0,
              view_count: post.view_count || 0,
              is_draft: false,
              is_deleted: false,
              tags: post.tags || []
            };
          });
          
          // Format PPV videos
          const formattedPpvVideos: SurveillanceContentItem[] = ppvVideos.map(video => {
            // Access the first profile in the array safely
            const profile = video.profiles?.[0];
            
            return {
              id: video.id,
              content_type: 'video',
              creator_id: video.creator_id,
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
              created_at: video.created_at,
              title: video.title || 'Untitled Video',
              description: video.description || '',
              media_urls: video.thumbnail_url ? [video.thumbnail_url] : [],
              video_url: video.video_url || null,
              visibility: video.visibility || 'public',
              is_ppv: true,
              ppv_amount: video.ppv_amount || 0,
              likes_count: video.like_count || 0,
              comments_count: video.comment_count || 0,
              view_count: video.view_count || 0,
              is_draft: false,
              is_deleted: false,
              tags: video.tags || []
            };
          });
          
          // Combine all PPV content
          setPpvContent([...formattedPpvPosts, ...formattedPpvVideos].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
          break;
        }
        
        case 'audio': {
          // Fetch audio content (sounds, voice memos)
          const { data, error } = await supabase
            .from('sounds')
            .select(`
              *,
              profiles:creator_id(username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) throw error;
          
          const formattedAudio: SurveillanceContentItem[] = data.map(sound => {
            // Access the first profile in the array safely
            const profile = sound.profiles?.[0];
            
            return {
              id: sound.id,
              content_type: 'audio',
              creator_id: sound.creator_id,
              username: profile?.username || 'Unknown',
              avatar_url: profile?.avatar_url || null,
              created_at: sound.created_at,
              title: sound.title || 'Untitled Audio',
              description: '',
              media_urls: [],
              audio_url: sound.audio_url || null,
              duration: sound.duration || 0,
              visibility: 'public',
              is_ppv: false,
              use_count: sound.use_count || 0,
              is_draft: false,
              is_deleted: false
            };
          });
          
          setAudioContent(formattedAudio);
          break;
        }
        
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      setError(`Failed to load ${contentType} content. Please try again.`);
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
    audioContent,
    isLoading,
    error,
    fetchContentByType
  };
}
