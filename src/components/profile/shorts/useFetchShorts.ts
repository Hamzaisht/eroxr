
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./types";
import { Post as SupabasePost } from "@/integrations/supabase/types/post";

export const useFetchShorts = (propShorts?: SupabasePost[] | Post[]) => {
  const { id } = useParams<{ id: string }>();
  const [shorts, setShorts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propShorts && propShorts.length > 0) {
      // Convert the Supabase Post type to our internal Post type
      const formattedShorts = propShorts.map(short => ({
        id: short.id,
        creator_id: short.creator_id,
        content: short.content,
        media_url: short.media_url || [],
        video_urls: short.video_urls,
        video_thumbnail_url: short.video_thumbnail_url,
        likes_count: short.likes_count || 0,
        comments_count: short.comments_count || 0,
        view_count: short.view_count,
        created_at: short.created_at,
        updated_at: short.updated_at,
        visibility: short.visibility || 'public',
        is_premium: 'is_ppv' in short ? short.is_ppv : false,
        post_type: 'post_type' in short ? short.post_type : 'short',
        has_saved: short.has_saved || false,
        price: 'ppv_amount' in short ? short.ppv_amount : undefined,
        tags: short.tags || []
      })) as Post[];
      
      setShorts(formattedShorts);
      setLoading(false);
      return;
    }
    
    const fetchShorts = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', id)
          .eq('post_type', 'short')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const formattedShorts = data?.map(short => ({
          id: short.id,
          creator_id: short.creator_id,
          content: short.content,
          media_url: short.media_url || [],
          video_urls: short.video_urls,
          video_thumbnail_url: short.video_thumbnail_url,
          likes_count: short.likes_count || 0,
          comments_count: short.comments_count || 0,
          view_count: short.view_count,
          created_at: short.created_at,
          updated_at: short.updated_at,
          visibility: short.visibility || 'public',
          is_premium: short.is_ppv || false,
          post_type: short.post_type || 'short',
          has_saved: short.has_saved || false,
          price: short.ppv_amount,
          tags: short.tags || []
        })) as Post[];
        
        setShorts(formattedShorts || []);
      } catch (error) {
        console.error('Error fetching shorts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShorts();
    }
  }, [id, propShorts]);

  return { shorts, loading, setShorts };
};
