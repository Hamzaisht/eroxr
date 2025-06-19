
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AdFormValues } from "../types";
import { asColumnValue } from "@/utils/supabase/helpers";

interface AdData {
  id: string;
  [key: string]: any;
}

interface SaveAdResult {
  success: boolean;
  data?: AdData;
  error?: string;
}

export const useAdDatabaseOperations = () => {
  const session = useSession();

  const saveAd = async (
    values: AdFormValues, 
    videoUrl: string | null, 
    avatarUrl: string | null,
    isSuperAdmin: boolean
  ): Promise<SaveAdResult> => {
    if (!session?.user?.id) {
      return { success: false, error: "No user session found" };
    }

    try {
      // Prepare the age range
      const ageRangeStr = `[${values.ageRange.lower},${values.ageRange.upper}]`;
      
      // Create the ad data object
      const adData = {
        user_id: session.user.id,
        title: values.title,
        description: values.description,
        relationship_status: values.relationshipStatus,
        looking_for: values.lookingFor,
        tags: values.tags || [],
        country: "sweden",
        city: values.location,
        age_range: ageRangeStr,
        body_type: values.bodyType,
        video_url: videoUrl,
        avatar_url: avatarUrl,
        // Fix the comparison - check for 'taken' which might indicate couple status
        user_type: values.relationshipStatus === "taken" ? "couple_mf" : "male",
        is_active: true,
        moderation_status: "approved",
      };
      
      console.log("Submitting ad data:", adData);

      const { data: insertedAd, error: insertError } = await supabase
        .from("dating_ads")
        .insert(adData)
        .select('id')
        .single();

      if (insertError) {
        console.error("Ad insertion error:", insertError);
        
        if (insertError.message.includes("moderation_status")) {
          throw new Error("The moderation_status column is missing. Please check database schema.");
        } else if (insertError.message.includes("permission denied")) {
          throw new Error("Permission denied. Check RLS policies or if you have admin access.");
        } else if (insertError.message.includes("violates not-null constraint")) {
          throw new Error("Missing required field. Please check the form data.");
        } else {
          throw new Error(`Failed to create ad: ${insertError.message}`);
        }
      }

      return { success: true, data: insertedAd };
    } catch (error: any) {
      console.error("Database operation error:", error);
      return { success: false, error: error.message };
    }
  };

  const saveAdMedia = async (adId: string, videoUrl: string | null, avatarUrl: string | null) => {
    if (!session?.user?.id) return false;
    
    if (videoUrl || avatarUrl) {
      const mediaData = {
        user_id: session.user.id,
        ad_id: adId,
        video_url: videoUrl,
        avatar_url: avatarUrl,
        created_at: new Date().toISOString()
      };
      
      console.log("Recording media data:", mediaData);
      
      const { error: mediaError } = await supabase
        .from("dating_ad_media")
        .insert(mediaData);

      if (mediaError) {
        console.error("Media recording error:", mediaError);
        return false;
      }
    }
    
    return true;
  };

  const updateProfileAvatar = async (avatarUrl: string | null) => {
    if (!session?.user?.id || !avatarUrl) return;
    
    console.log("Updating profile with avatar URL using RLS-bypass:", avatarUrl);
    
    try {
      // Use the new RLS-bypass profile update function
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: session.user.id,
        p_username: null,
        p_bio: null,
        p_location: null,
        p_avatar_url: avatarUrl,
        p_banner_url: null,
        p_interests: null,
        p_profile_visibility: null,
        p_status: null,
      });

      if (!rpcError && result?.success) {
        console.log("✅ Profile avatar updated successfully via RLS-bypass");
        return true;
      }

      console.error("❌ RLS-bypass profile update failed:", rpcError || result?.error);
      return false;
    } catch (error: any) {
      console.error("💥 Profile avatar update error:", error);
      return false;
    }
  };

  return { saveAd, saveAdMedia, updateProfileAvatar };
};
