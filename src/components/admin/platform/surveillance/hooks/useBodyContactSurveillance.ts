
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
      const { data: datingAds, error: adsError } = await supabase
        .from('dating_ads')
        .select(`
          id,
          user_id,
          title,
          description,
          created_at,
          updated_at,
          last_active,
          profiles:user_id(username, avatar_url)
        `)
        .order('last_active', { ascending: false })
        .limit(20);
        
      if (adsError) {
        console.error("Error fetching body contact listings:", adsError);
        return [];
      }
      
      return (datingAds || []).map((ad: any) => ({
        id: ad.id,
        type: 'bodycontact' as const,
        user_id: ad.user_id,
        username: ad.profiles?.username || 'Unknown',
        avatar_url: ad.profiles?.avatar_url || null,
        created_at: ad.created_at,
        title: ad.title,
        description: ad.description,
        updated_at: ad.updated_at,
        last_active: ad.last_active,
        status: 'active',
        content_type: 'bodycontact',
        media_url: []
      }));
    } catch (error) {
      console.error("Error fetching body contact:", error);
      toast({
        title: "Error",
        description: "Could not load bodycontact listings",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchBodyContact };
}
