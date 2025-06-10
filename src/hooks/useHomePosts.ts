
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useHomePosts = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['home-posts'],
    queryFn: async () => {
      console.log("Home - Fetching posts with proper relationships...");
      
      try {
        // Use the new post_id relationship for clean joins
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
              alt_text
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
        
        // Transform the data to ensure proper structure
        const transformedPosts = postsData.map((post) => {
          const creator = post.creator && !Array.isArray(post.creator) 
            ? post.creator 
            : Array.isArray(post.creator) && post.creator.length > 0
            ? post.creator[0]
            : null;

          return {
            ...post,
            creator: {
              id: creator?.id || post.creator_id || '',
              username: creator?.username || 'Anonymous',
              avatar_url: creator?.avatar_url || null,
              bio: creator?.bio || '',
              location: creator?.location || ''
            },
            media_assets: Array.isArray(post.media_assets) ? post.media_assets : []
          };
        });

        console.log("Home - Posts transformed successfully:", transformedPosts.length);
        return transformedPosts;
      } catch (error) {
        console.error("Home - Failed to fetch posts:", error);
        throw error;
      }
    },
    enabled: !!session,
    retry: 2,
    staleTime: 30000, // 30 seconds
    refetchInterval: false
  });
};
