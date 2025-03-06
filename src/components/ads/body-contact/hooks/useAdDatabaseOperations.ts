
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AdFormValues } from "../types";

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
        tags: values.tags || [], // Handle tags properly
        country: "sweden", // Default for demo
        city: values.location,
        age_range: ageRangeStr,
        body_type: values.bodyType,
        video_url: videoUrl,
        avatar_url: avatarUrl,
        user_type: values.relationshipStatus === "couple" ? "couple_mf" : "male",
        is_active: true,
        moderation_status: isSuperAdmin ? "approved" : "pending", // Super admins get auto-approved
      };
      
      console.log("Submitting ad data:", adData);

      // Insert ad and get the returned id
      const { data: insertedAd, error: insertError } = await supabase
        .from("dating_ads")
        .insert(adData)
        .select('id')
        .single();

      if (insertError) {
        console.error("Ad insertion error:", insertError);
        
        // Check for common errors
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
    
    console.log("Updating profile with avatar URL:", avatarUrl);
    
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", session.user.id);

    if (profileError) {
      console.error("Avatar profile update error:", profileError);
    }
  };

  return { saveAd, saveAdMedia, updateProfileAvatar };
};
