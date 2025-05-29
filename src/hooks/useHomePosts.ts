
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useHomePosts = () => {
  const session = useSession();

  return useQuery({
    queryKey: ['home-posts'],
    queryFn: async () => {
      console.log("Home - Fetching posts with profiles and media...");
      
      try {
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
              bio,
              location
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
        
        const postsWithMedia = await Promise.all(
          postsData.map(async (post) => {
            try {
              console.log(`Home - Fetching media for post ${post.id}...`);
              
              // Primary query: Look for media assets with post_id in metadata
              const { data: primaryAssets, error: primaryError } = await supabase
                .from('media_assets')
                .select('*')
                .eq('metadata->>post_id', post.id);

              if (primaryError) {
                console.error("Home - Error in primary media fetch:", primaryError);
              }

              console.log(`Home - Primary media assets for post ${post.id}:`, primaryAssets?.length || 0);

              let mediaAssets = primaryAssets || [];

              // Fallback query: Look for recent orphaned assets if no primary assets found
              if (mediaAssets.length === 0) {
                console.log(`Home - No primary media found for post ${post.id}, checking fallback conditions...`);
                
                const postTime = new Date(post.created_at);
                const currentTime = new Date();
                const postAgeSeconds = (currentTime.getTime() - postTime.getTime()) / 1000;
                
                // Only do fallback for very recent posts (within 30 seconds)
                if (postAgeSeconds <= 30) {
                  console.log(`Home - Post ${post.id} is very recent (${postAgeSeconds.toFixed(1)} seconds old), attempting restricted fallback...`);
                  
                  const fallbackStartTime = new Date(postTime.getTime() - 30 * 1000);
                  const fallbackEndTime = new Date(postTime.getTime() + 30 * 1000);

                  const { data: recentOrphanedAssets, error: orphanedError } = await supabase
                    .from('media_assets')
                    .select('*')
                    .eq('user_id', post.creator_id)
                    .eq('metadata->>usage', 'post')
                    .is('metadata->>post_id', null)
                    .eq('access_level', 'public')
                    .gte('created_at', fallbackStartTime.toISOString())
                    .lte('created_at', fallbackEndTime.toISOString())
                    .limit(3);

                  if (orphanedError) {
                    console.error("Home - Error in orphaned media fetch:", orphanedError);
                  } else {
                    console.log(`Home - Recent orphaned media assets for post ${post.id}:`, recentOrphanedAssets?.length || 0);
                    
                    if (recentOrphanedAssets && recentOrphanedAssets.length > 0) {
                      const safeAssets = recentOrphanedAssets.filter(asset => {
                        const assetTime = new Date(asset.created_at);
                        const timeDiff = Math.abs(assetTime.getTime() - postTime.getTime()) / 1000;
                        return timeDiff <= 30;
                      });
                      
                      if (safeAssets.length > 0) {
                        mediaAssets = safeAssets;
                        console.log(`Home - Using ${safeAssets.length} safe orphaned assets for post ${post.id} (NOT auto-linking)`);
                      }
                    }
                  }
                } else {
                  console.log(`Home - Post ${post.id} is too old (${postAgeSeconds.toFixed(1)} seconds) for fallback, skipping`);
                }
              }

              const creator = post.creator && !Array.isArray(post.creator) 
                ? post.creator 
                : Array.isArray(post.creator) && post.creator.length > 0
                ? post.creator[0]
                : null;

              const finalPost = {
                ...post,
                creator: {
                  id: creator?.id || post.creator_id || '',
                  username: creator?.username || 'Anonymous',
                  bio: creator?.bio || '',
                  location: creator?.location || ''
                },
                media_assets: mediaAssets
              };

              console.log(`Home - Final post ${post.id} media count:`, finalPost.media_assets.length);
              
              return finalPost;
            } catch (error) {
              console.error("Home - Error processing post:", post.id, error);
              return {
                ...post,
                creator: {
                  id: post.creator_id || '',
                  username: 'Anonymous',
                  bio: '',
                  location: ''
                },
                media_assets: []
              };
            }
          })
        );

        console.log("Home - Posts with media processed:", postsWithMedia.length);
        return postsWithMedia;
      } catch (error) {
        console.error("Home - Failed to fetch posts:", error);
        throw error;
      }
    },
    enabled: !!session,
    retry: 3,
    staleTime: 0,
    refetchInterval: false
  });
};
