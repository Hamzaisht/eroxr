
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../../user-analytics/types";

export function useBodyContactSurveillance() {
  const session = useSession();
  
  const fetchBodyContact = useCallback(async (): Promise<LiveSession[]> => {
    if (!session?.user?.id) return [];
    
    try {
      // Get active body contact ads - include specific user data
      console.log("Fetching body contact ads for surveillance...");
      
      const { data, error } = await supabase
        .from('dating_ads')
        .select(`
          id,
          user_id,
          title,
          description,
          location,
          tags,
          created_at,
          updated_at,
          status,
          is_active,
          video_url,
          about_me,
          avatar_url,
          profiles:user_id (
            username,
            avatar_url,
            about_me
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error("Error fetching body contact data:", error);
        throw new Error("Failed to load BodyContact data");
      }
      
      console.log("Body contact data fetched:", data?.length || 0, "records");
      console.log("Sample body contact data:", data?.[0] || "No body contact ads found");
      
      if (!data) return [];
      
      // Transform data to match LiveSession format
      return data.map(ad => ({
        id: ad.id,
        type: 'bodycontact' as const,
        user_id: ad.user_id,
        username: ad.profiles?.[0]?.username || "Unknown",
        avatar_url: ad.profiles?.[0]?.avatar_url || ad.avatar_url || null,
        title: ad.title || "Untitled Ad",
        description: ad.description,
        status: ad.is_active ? 'active' : 'inactive',
        location: ad.location,
        tags: ad.tags,
        started_at: ad.created_at,
        created_at: ad.created_at,
        about_me: ad.about_me || ad.profiles?.[0]?.about_me,
        video_url: ad.video_url,
        media_url: ad.avatar_url ? [ad.avatar_url] : [],
        content_type: 'bodycontact'
      }));
    } catch (error) {
      console.error("Error in fetchBodyContact:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  return { fetchBodyContact };
}
