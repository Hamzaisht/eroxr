
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
      // First fetch the dating ads (without trying to join profiles directly)
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
          latitude,
          longitude,
          view_count,
          click_count,
          message_count
        `)
        .order('last_active', { ascending: false })
        .limit(30);
        
      if (adsError) {
        console.error("Error loading bodycontact sessions:", adsError);
        toast({
          title: "Error",
          description: "Could not load bodycontact ads",
          variant: "destructive"
        });
        return [];
      }
      
      // Now fetch profiles for the user_ids in the ads
      const userIds = ads.map(ad => ad.user_id).filter(Boolean);
      
      let userProfiles = {};
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, id_verification_status')
          .in('id', userIds);
          
        if (!profilesError && profiles) {
          // Create a lookup object for profiles
          userProfiles = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        } else {
          console.warn("Could not fetch profiles for bodycontact ads:", profilesError);
        }
      }
      
      return ads.map(ad => {
        // Get profile data if available
        const profile = userProfiles[ad.user_id] || {};
        
        // Ensure started_at is always present and valid
        const startedAt = ad.last_active || ad.created_at || new Date().toISOString();
        
        return {
          id: ad.id,
          type: 'bodycontact' as const,
          user_id: ad.user_id,
          username: profile.username || 'Unknown',
          avatar_url: profile.avatar_url || ad.avatar_url || '',
          started_at: startedAt, // Ensure required field is present
          status: ad.moderation_status === 'pending' ? 'active' : 'flagged',
          title: ad.title,
          description: ad.description,
          about_me: ad.about_me,
          location: `${ad.city}, ${ad.country}`,
          tags: ad.tags,
          content_type: 'ad',
          created_at: ad.created_at,
          media_url: [], // Always provide an empty array as default
          // Additional metadata for moderation
          metadata: {
            latitude: ad.latitude,
            longitude: ad.longitude,
            view_count: ad.view_count,
            click_count: ad.click_count,
            message_count: ad.message_count,
            verification_status: profile.id_verification_status || 'unknown'
          }
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
