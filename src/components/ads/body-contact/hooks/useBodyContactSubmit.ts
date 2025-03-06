
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdFormValues } from "../types";

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

      if (profileError) throw profileError;

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

      if (values.videoFile) {
        const videoFileName = `${session.user.id}/${Date.now()}_video.mp4`;
        const { error: videoError } = await supabase.storage
          .from('dating-videos')
          .upload(videoFileName, values.videoFile);

        if (videoError) throw videoError;

        const { data: { publicUrl } } = supabase.storage
          .from('dating-videos')
          .getPublicUrl(videoFileName);
        
        videoUrl = publicUrl;
      }

      if (values.avatarFile) {
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        const { error: avatarError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, values.avatarFile);

        if (avatarError) throw avatarError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName);
        
        avatarUrl = publicUrl;
      }

      // Insert ad with moderation status
      const { error } = await supabase
        .from("dating_ads")
        .insert({
          user_id: session.user.id,
          title: values.title,
          description: values.description,
          relationship_status: values.relationshipStatus,
          looking_for: values.lookingFor,
          tags: values.tags,
          country: "sweden", // Default for demo
          city: values.location,
          age_range: `[${values.ageRange.lower},${values.ageRange.upper}]`,
          body_type: values.bodyType,
          video_url: videoUrl,
          user_type: values.relationshipStatus === "couple" ? "couple_mf" : "male",
          is_active: true,
          moderation_status: "pending", // Default to pending for review
        });

      if (error) throw error;

      if (avatarUrl) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", session.user.id);

        if (profileError) throw profileError;
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
        description: "Failed to create body contact ad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
