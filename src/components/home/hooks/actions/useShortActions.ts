
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useShortActions = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const likeShort = useCallback(async (shortId: string) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .insert({ 
          post_id: shortId,
          user_id: user.id 
        });

      if (error) throw error;
      
      // Increment like count
      await supabase.rpc('increment_counter', {
        row_id: shortId,
        counter_name: 'like_count',
        table_name: 'videos'
      });
      
      return true;
    } catch (error) {
      console.error("Error liking short:", error);
      toast({
        title: "Error",
        description: "Could not like this video. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const unlikeShort = useCallback(async (shortId: string) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', shortId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Manually decrement like count
      const { data: currentVideo } = await supabase
        .from('videos')
        .select('like_count')
        .eq('id', shortId)
        .single();
      
      if (currentVideo) {
        await supabase
          .from('videos')
          .update({ like_count: Math.max(0, (currentVideo.like_count || 0) - 1) })
          .eq('id', shortId);
      }
      
      return true;
    } catch (error) {
      console.error("Error unliking short:", error);
      toast({
        title: "Error",
        description: "Could not unlike this video. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const saveShort = useCallback(async (shortId: string) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_saves')
        .insert({ 
          post_id: shortId,
          user_id: user.id 
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error saving short:", error);
      toast({
        title: "Error",
        description: "Could not save this video. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const unsaveShort = useCallback(async (shortId: string) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_saves')
        .delete()
        .eq('post_id', shortId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error unsaving short:", error);
      toast({
        title: "Error",
        description: "Could not unsave this video. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const deleteShort = useCallback(async (shortId: string) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete associated data first
      await Promise.all([
        supabase.from('post_likes').delete().eq('post_id', shortId),
        supabase.from('post_saves').delete().eq('post_id', shortId),
        supabase.from('comments').delete().eq('post_id', shortId),
        supabase.from('post_media_actions').delete().eq('post_id', shortId)
      ]);

      // Delete the video
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', shortId)
        .eq('creator_id', user.id); // Ensure user owns the video

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting short:", error);
      toast({
        title: "Error",
        description: "Could not delete this video. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const shareShort = useCallback(async (video: any) => {
    try {
      const shareUrl = `${window.location.origin}/shorts/${video.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description || 'Check out this video!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied! 📋",
          description: "Video link copied to clipboard",
        });
      }

      // Increment share count
      await supabase.rpc('increment_counter', {
        row_id: video.id,
        counter_name: 'share_count',
        table_name: 'videos'
      });

      return true;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Error sharing short:", error);
        toast({
          title: "Error",
          description: "Could not share this video. Please try again.",
          variant: "destructive",
        });
      }
      return false;
    }
  }, [toast]);

  const checkUserInteractions = useCallback(async (shortId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { hasLiked: false, hasSaved: false };

      const [likesData, savesData] = await Promise.all([
        supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', shortId)
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('post_saves')
          .select('id')
          .eq('post_id', shortId)
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      return {
        hasLiked: !!likesData.data,
        hasSaved: !!savesData.data
      };
    } catch (error) {
      console.error("Error checking user interactions:", error);
      return { hasLiked: false, hasSaved: false };
    }
  }, []);

  return {
    likeShort,
    unlikeShort,
    saveShort,
    unsaveShort,
    deleteShort,
    shareShort,
    checkUserInteractions,
    isProcessing
  };
};
