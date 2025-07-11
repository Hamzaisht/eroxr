import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export const useUserFromPost = (postId?: string, creatorId?: string) => {
  return useQuery({
    queryKey: ['user-from-post', postId, creatorId],
    queryFn: async () => {
      if (!creatorId && !postId) return null;
      
      let userId = creatorId;
      
      // If we only have postId, get the creator_id from the post
      if (!userId && postId) {
        const { data: post } = await supabase
          .from('posts')
          .select('creator_id')
          .eq('id', postId)
          .single();
        
        if (!post?.creator_id) return null;
        userId = post.creator_id;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single();
      
      return profile as UserProfile | null;
    },
    enabled: Boolean(postId || creatorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatorUsername = (creatorId?: string) => {
  const { data: user } = useUserFromPost(undefined, creatorId);
  return user?.username || 'unknown';
};