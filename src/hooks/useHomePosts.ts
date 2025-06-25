
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useOrphanedAssetsCleanup } from "./useOrphanedAssetsCleanup";
import { useEffect } from "react";

export const useHomePosts = () => {
  const { session, user } = useAuth();
  const { cleanupOrphanedAssets } = useOrphanedAssetsCleanup();

  // Trigger cleanup periodically but less frequently to avoid performance issues
  useEffect(() => {
    if (user?.id) {
      const cleanup = () => cleanupOrphanedAssets(user.id);
      
      // Run cleanup on mount but with a delay
      const timeoutId = setTimeout(cleanup, 2000);
      
      // Set up periodic cleanup every 15 minutes (increased from 10)
      const interval = setInterval(cleanup, 15 * 60 * 1000);
      
      return () => {
        clearTimeout(timeoutId);
        clearInterval(interval);
      };
    }
  }, [user?.id, cleanupOrphanedAssets]);

  return useQuery({
    queryKey: ['home-posts', user?.id],
    queryFn: async () => {
      console.log("🏠 Home - Fetching posts with optimized RLS...");
      
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
          post_likes(
            user_id
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        console.error("❌ Home - Error fetching posts:", postsError);
        throw new Error(postsError.message || "Failed to fetch posts");
      }

      console.log("✅ Home - Posts fetched successfully:", {
        count: postsData?.length || 0,
        hasData: !!postsData,
        sample: postsData?.[0] ? {
          id: postsData[0].id,
          hasMediaAssets: !!postsData[0].media_assets,
          mediaCount: postsData[0].media_assets?.length || 0,
          creatorExists: !!postsData[0].creator
        } : null
      });

      // Return empty array if no data to prevent loading issues
      if (!postsData || postsData.length === 0) {
        console.log("📭 Home - No posts found, returning empty array");
        return [];
      }

      // Transform the data safely
      const transformedData = postsData.map(post => {
        // Ensure creator data is properly structured
        const creator = Array.isArray(post.creator) ? post.creator[0] : post.creator;
        
        // Check if current user has liked this post
        const isLiked = user?.id ? post.post_likes?.some((like: any) => like.user_id === user.id) : false;
        
        return {
          ...post,
          creator: creator || {
            id: post.creator_id,
            username: "Unknown User",
            avatar_url: null,
            bio: null,
            location: null
          },
          media_assets: Array.isArray(post.media_assets) ? post.media_assets.filter(asset => asset && asset.storage_path) : [],
          isLiked,
          isSaved: false // TODO: Add saved posts functionality
        };
      });

      console.log("🔄 Home - Data transformed successfully:", {
        originalCount: postsData.length,
        transformedCount: transformedData.length,
        firstPostHasCreator: !!transformedData[0]?.creator?.username
      });

      return transformedData;
    },
    enabled: true, // Always enabled to show public posts
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
