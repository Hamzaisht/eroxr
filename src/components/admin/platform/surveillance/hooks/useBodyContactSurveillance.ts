
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types";

export function useBodyContactSurveillance() {
  const { toast } = useToast();
  const session = useSession();

  const fetchBodyContact = useCallback(async () => {
    if (!session?.user?.id) return [];
    
    try {
      const { data: ads, error: adsError } = await supabase
        .from('dating_ads')
        .select(`
          id,
          user_id,
          title,
          description,
          about_me,
          moderation_status,
          created_at,
          last_active,
          city,
          country,
          tags,
          avatar_url,
          profiles(username, avatar_url)
        `)
        .order('last_active', { ascending: false })
        .limit(30);
        
      if (adsError) {
        console.error("Error loading bodycontact sessions:", adsError);
        toast({
          title: "Error",
          description: "Could not load live bodycontact",
          variant: "destructive"
        });
        return [];
      }
      
      return ads.map(ad => {
        // Ensure started_at is always present and valid
        const startedAt = ad.last_active || ad.created_at || new Date().toISOString();
        
        return {
          id: ad.id,
          type: 'bodycontact' as const,
          user_id: ad.user_id,
          username: ad.profiles && ad.profiles[0] ? ad.profiles[0].username || 'Unknown' : 'Unknown',
          avatar_url: ad.profiles && ad.profiles[0] ? ad.profiles[0].avatar_url || ad.avatar_url || '' : ad.avatar_url || '',
          started_at: startedAt, // Ensure required field is present
          status: ad.moderation_status === 'pending' ? 'active' : 'flagged',
          title: ad.title,
          description: ad.description,
          about_me: ad.about_me,
          location: `${ad.city}, ${ad.country}`,
          tags: ad.tags,
          content_type: 'ad',
          created_at: ad.created_at
        };
      });
    } catch (error) {
      console.error("Error fetching body contact ads:", error);
      toast({
        title: "Error",
        description: "Could not load body contact ads",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchBodyContact };
}
