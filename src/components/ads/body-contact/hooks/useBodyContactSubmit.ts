
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdFormValues } from "../types";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";

interface UseBodyContactSubmitProps {
  onSuccess?: () => void;
  onComplete?: () => void;
  isSuperAdmin?: boolean;
}

export const useBodyContactSubmit = ({ 
  onSuccess, 
  onComplete,
  isSuperAdmin = false
}: UseBodyContactSubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleSubmit = async (values: AdFormValues) => {
    if (!session?.user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to create a body contact ad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, check if user is allowed to create a Body Contact ad (skip for super admin)
      if (!isSuperAdmin) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_paying_customer, id_verification_status")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        if (!profileData.is_paying_customer) {
          toast({
            title: "Premium required",
            description: "You need a premium subscription to create body contact ads",
            variant: "destructive",
          });
          return;
        }

        if (profileData.id_verification_status !== 'verified') {
          toast({
            title: "Verification required",
            description: "You need to verify your ID to create body contact ads",
            variant: "destructive",
          });
          return;
        }
      } else {
        console.log("Super admin detected - bypassing verification and premium checks");
      }

      let videoUrl = null;
      let avatarUrl = null;

      // Validate required fields before uploading
      if (!values.title || !values.description || !values.relationshipStatus || !values.location) {
        throw new Error("Please fill all required fields");
      }

      // Check if Looking For is selected
      if (!values.lookingFor || values.lookingFor.length === 0) {
        throw new Error("Please select at least one 'Looking For' option");
      }

      // Check for at least one media item (photo or video)
      if (!values.videoFile && !values.avatarFile) {
        throw new Error("At least one photo or video is required. Please upload media content.");
      }

      // Video Upload Process - with improved error handling
      if (values.videoFile) {
        console.log("Processing video file:", values.videoFile.name, values.videoFile.size);
        
        try {
          // Validate video format
          const isValidVideo = await validateVideoFormat(values.videoFile);
          if (!isValidVideo) {
            throw new Error("Invalid video format. Please upload a valid video file.");
          }
          
          // Get video duration
          const duration = await getVideoDuration(values.videoFile);
          console.log("Video duration:", duration);
          
          if (duration > 120) { // More than 2 minutes
            throw new Error("Video is too long. Maximum duration is 2 minutes.");
          }
          
          const videoFileName = `${session.user.id}/${Date.now()}_video.mp4`;
          console.log("Uploading video to path:", videoFileName);
          
          const { error: videoError, data: videoData } = await supabase.storage
            .from('dating-videos')
            .upload(videoFileName, values.videoFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (videoError) {
            console.error("Video upload error:", videoError);
            throw new Error(`Video upload failed: ${videoError.message}`);
          }

          console.log("Video upload successful:", videoData);
          
          const { data: { publicUrl } } = supabase.storage
            .from('dating-videos')
            .getPublicUrl(videoFileName);
          
          videoUrl = publicUrl;
          console.log("Generated video URL:", videoUrl);
        } catch (error: any) {
          console.error("Video processing error:", error);
          throw new Error(`Video processing failed: ${error.message}`);
        }
      }

      // Avatar Upload Process
      if (values.avatarFile) {
        console.log("Uploading avatar file:", values.avatarFile.name, values.avatarFile.size);
        
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        const { error: avatarError, data: avatarData } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, values.avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (avatarError) {
          console.error("Avatar upload error:", avatarError);
          throw new Error(`Avatar upload failed: ${avatarError.message}`);
        }

        console.log("Avatar upload successful:", avatarData);
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName);
        
        avatarUrl = publicUrl;
        console.log("Generated avatar URL:", avatarUrl);
      }

      // Prepare the age range
      const ageRangeStr = `[${values.ageRange.lower},${values.ageRange.upper}]`;
      console.log("Age range:", ageRangeStr);
      console.log("Looking for:", values.lookingFor);

      // Create the ad data object
      const adData = {
        user_id: session.user.id,
        title: values.title,
        description: values.description,
        relationship_status: values.relationshipStatus,
        looking_for: values.lookingFor,
        tags: values.tags,
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

      // Insert ad
      const { error: insertError } = await supabase
        .from("dating_ads")
        .insert(adData);

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

      // Track the dating ad media for the user profile
      const { error: trackingError } = await supabase
        .from("dating_ad_media")
        .insert({
          user_id: session.user.id,
          ad_id: adData.id,
          video_url: videoUrl,
          avatar_url: avatarUrl,
          created_at: new Date().toISOString()
        });

      if (trackingError) {
        console.error("Media tracking error:", trackingError);
        // Don't throw, just log - we've already created the ad
      }

      if (avatarUrl) {
        console.log("Updating profile with avatar URL:", avatarUrl);
        
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", session.user.id);

        if (profileError) {
          console.error("Avatar profile update error:", profileError);
          // Don't throw, just log - we've already created the ad
        }
      }

      toast({
        title: "Success!",
        description: isSuperAdmin 
          ? "Your body contact ad has been published immediately!" 
          : "Your body contact ad has been submitted for review",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create body contact ad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
