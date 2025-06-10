
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

      console.log("Home - Posts fetched successfully:", postsData?.length || 0);
      
      if (!postsData || postsData.length === 0) {
        console.log("Home - No posts found");
        return [];
      }
      
      // Transform and validate the data
      const transformedPosts = postsData.map((post) => {
        const creator = post.creator && !Array.isArray(post.creator) 
          ? post.creator 
          : Array.isArray(post.creator) && post.creator.length > 0
          ? post.creator[0]
          : null;

        // Enhanced media assets filtering and validation
        const mediaAssets = Array.isArray(post.media_assets) 
          ? post.media_assets.filter(asset => 
              asset && 
              asset.id && 
              asset.storage_path && 
              asset.media_type && 
              asset.mime_type &&
              asset.post_id === post.id // Ensure asset is properly linked
            )
          : [];

        const transformedPost = {
          ...post,
          creator: {
            id: creator?.id || post.creator_id || '',
            username: creator?.username || 'Anonymous',
            avatar_url: creator?.avatar_url || null,
            bio: creator?.bio || '',
            location: creator?.location || ''
          },
          media_assets: mediaAssets
        };

        console.log(`Home - Post ${post.id} has ${mediaAssets.length} valid media assets:`, 
          mediaAssets.map(a => ({ id: a.id, type: a.media_type, linked: a.post_id === post.id }))
        );
        
        return transformedPost;
      });

      console.log("Home - Posts transformed successfully:", transformedPosts.length);
      return transformedPosts;
    },
    enabled: true, // Always enable, not dependent on session
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
