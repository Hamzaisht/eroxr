
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useShortActions = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const likeShort = useCallback(async (shortId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: shortId });

      if (error) throw error;
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
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', shortId);

      if (error) throw error;
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
      const { error } = await supabase
        .from('post_saves')
        .insert({ post_id: shortId });

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
      const { error } = await supabase
        .from('post_saves')
        .delete()
        .eq('post_id', shortId);

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

  return {
    likeShort,
    unlikeShort,
    saveShort,
    unsaveShort,
    isProcessing
  };
};
