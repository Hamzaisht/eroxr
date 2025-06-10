
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useOrphanedAssetsCleanup } from "./useOrphanedAssetsCleanup";
import { useEffect } from "react";

export const useHomePosts = () => {
  const { session, user } = useAuth();
  const { cleanupOrphanedAssets } = useOrphanedAssetsCleanup();

  // Trigger cleanup periodically
  useEffect(() => {
    if (user?.id) {
      const cleanup = () => cleanupOrphanedAssets(user.id);
      
      // Run cleanup on mount
      cleanup();
      
      // Set up periodic cleanup every 10 minutes
      const interval = setInterval(cleanup, 10 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id, cleanupOrphanedAssets]);

  return useQuery({
    queryKey: ['home-posts', user?.id],
    queryFn: async () => {
      console.log("Home - Fetching posts...");
      
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          creator_id,
          created_at,
          updated_at,
          likes_count,
          comments_count,
          visibility,
          view_count,
          share_count,
          engagement_score,
          is_ppv,
          ppv_amount,
          metadata,
          creator:profiles!posts_creator_id_fkey(
            id, 
            username,
            avatar_url,
            bio,
            location
          ),
          media_assets!media_assets_post_id_fkey(
            id,
            storage_path,
            media_type,
            mime_type,
            original_name,
            alt_text,
            post_id,
            file_size,
            access_level
          ),
          post_likes!inner(
            user_id
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        console.error("Home - Error fetching posts:", postsError);
        throw new Error(postsError.message || "Failed to fetch posts");
      }

      console.log("Home - Posts fetched successfully:", {
        count: postsData?.length || 0,
        sample: postsData?.[0] ? {
          id: postsData[0].id,
          hasMediaAssets: !!postsData[0].media_assets,
          mediaCount: postsData[0].media_assets?.length || 0,
          creatorType: typeof postsData[0].creator,
          mediaAssets: postsData[0].media_assets
        } : null
      });

      // Transform the data to ensure creator is always an object, not an array
      const transformedData = postsData?.map(post => {
        // Check if current user has liked this post
        const isLiked = user?.id ? post.post_likes?.some((like: any) => like.user_id === user.id) : false;
        
        return {
          ...post,
          creator: Array.isArray(post.creator) ? post.creator[0] : post.creator,
          isLiked,
          isSaved: false // TODO: Add saved posts functionality
        };
      }) || [];

      // Debug logging for each post's media assets
      transformedData.forEach(post => {
        console.log(`Post ${post.id} media assets:`, {
          hasMedia: !!post.media_assets,
          count: post.media_assets?.length || 0,
          assets: post.media_assets,
          validAssets: post.media_assets?.filter(asset => asset && asset.storage_path)
        });
      });

      return transformedData;
    },
    enabled: true,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
