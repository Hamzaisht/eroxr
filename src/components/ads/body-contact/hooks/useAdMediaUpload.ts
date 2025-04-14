
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";

interface MediaUploadResult {
  videoUrl: string | null;
  avatarUrl: string | null;
  error?: string;
}

export const useAdMediaUpload = () => {
  const session = useSession();

  const uploadMedia = async (videoFile: File | null, avatarFile: File | null): Promise<MediaUploadResult> => {
    if (!session?.user?.id) {
      return { videoUrl: null, avatarUrl: null, error: "No user session found" };
    }

    let videoUrl = null;
    let avatarUrl = null;

    try {
      // Video Upload Process
      if (videoFile) {
        console.log("Processing video file:", videoFile.name, videoFile.size);
        
        // Validate video format
        const isValidVideo = await validateVideoFormat(videoFile);
        if (!isValidVideo) {
          throw new Error("Invalid video format. Please upload a valid video file.");
        }
        
        // Get video duration
        const duration = await getVideoDuration(videoFile);
        console.log("Video duration:", duration);
        
        if (duration > 120) { // More than 2 minutes
          throw new Error("Video is too long. Maximum duration is 2 minutes.");
        }
        
        const videoFileName = `${session.user.id}/${Date.now()}_video.mp4`;
        console.log("Uploading video to path:", videoFileName);
        
        const { error: videoError, data: videoData } = await supabase.storage
          .from('dating-videos')
          .upload(videoFileName, videoFile, {
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
      }

      // Avatar Upload Process
      if (avatarFile) {
        console.log("Uploading avatar file:", avatarFile.name, avatarFile.size);
        
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        
        const { error: avatarError, data: avatarData } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg'
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

      return { videoUrl, avatarUrl };
    } catch (error: any) {
      console.error("Media upload error:", error);
      return { videoUrl: null, avatarUrl: null, error: error.message };
    }
  };

  return { uploadMedia };
};
