
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdFormValues } from "../types";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";

interface UseBodyContactSubmitProps {
  onSuccess?: () => void;
  onComplete?: () => void;
}

export const useBodyContactSubmit = ({ onSuccess, onComplete }: UseBodyContactSubmitProps) => {
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
      // First, check if user is allowed to create a Body Contact ad
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

      let videoUrl = null;
      let avatarUrl = null;

      // Video Upload Process
      if (values.videoFile) {
        console.log("Validating video file:", values.videoFile.name, values.videoFile.size);
        
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
          .upload(videoFileName, values.videoFile);

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
      } else {
        console.log("No video file provided");
      }

      // Avatar Upload Process
      if (values.avatarFile) {
        console.log("Uploading avatar file:", values.avatarFile.name, values.avatarFile.size);
        
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        const { error: avatarError, data: avatarData } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, values.avatarFile);

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

      // Validate required fields
      if (!values.title || !values.description || !values.relationshipStatus || !values.location) {
        throw new Error("Please fill all required fields");
      }

      // Check if Looking For is selected
      if (!values.lookingFor || values.lookingFor.length === 0) {
        throw new Error("Please select at least one 'Looking For' option");
      }

      if (!videoUrl) {
        throw new Error("Video is required. Please upload a video.");
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
        user_type: values.relationshipStatus === "couple" ? "couple_mf" : "male",
        is_active: true,
        moderation_status: "pending", // Default to pending for review
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
        description: "Your body contact ad has been submitted for review",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
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
