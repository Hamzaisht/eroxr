
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useOrphanedAssetsCleanup } from "./useOrphanedAssetsCleanup";
import { useEffect } from "react";

export const useHomePosts = () => {
  const { session, user } = useAuth();
  const { cleanupOrphanedAssets } = useOrphanedAssetsCleanup();

  // Disabled automatic cleanup to prevent performance issues and infinite re-renders
  // Cleanup will be triggered manually when needed
  useEffect(() => {
    if (user?.id) {
      // Only run cleanup once on mount after a significant delay
      const timeoutId = setTimeout(() => {
        cleanupOrphanedAssets(user.id);
      }, 30000); // 30 seconds delay
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [user?.id]); // Removed cleanupOrphanedAssets dependency to prevent re-renders

  return useQuery(
    ['home-posts', user?.id],
    async () => {
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
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        throw new Error(postsError.message || "Failed to fetch posts");
      }

      // Return empty array if no data to prevent loading issues
      if (!postsData || postsData.length === 0) {
        return [];
      }

      // Transform the data safely
      const transformedData = postsData.map(post => {
        // Ensure creator data is properly structured
        const creator = Array.isArray(post.creator) ? post.creator[0] : post.creator;
        
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
          isLiked: false, // Will be updated by post actions hook
          isSaved: false // TODO: Add saved posts functionality
        };
      });

      return transformedData;
    },
    {
      enabled: true, // Always enabled to show public posts
      staleTime: 30000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );
};
