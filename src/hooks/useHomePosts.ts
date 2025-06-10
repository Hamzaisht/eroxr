
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useHomePosts = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['home-posts'],
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
          creatorType: typeof postsData[0].creator
        } : null
      });

      // Transform the data to ensure creator is always an object, not an array
      const transformedData = postsData?.map(post => ({
        ...post,
        creator: Array.isArray(post.creator) ? post.creator[0] : post.creator
      })) || [];

      return transformedData;
    },
    enabled: true,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
