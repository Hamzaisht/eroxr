
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
        // Debug file info
        console.log("FILE DEBUG:", {
          file: videoFile,
          isFile: videoFile instanceof File,
          type: videoFile?.type,
          size: videoFile?.size,
          name: videoFile?.name
        });
        
        // Validate file type
        if (!(videoFile instanceof File)) {
          throw new Error("Invalid video file object");
        }
        
        const isValidVideoType = videoFile.type.startsWith("video/");
        if (!isValidVideoType) {
          throw new Error(`Invalid file type: ${videoFile.type}. Only videos are allowed.`);
        }
        
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
        
        // Upload with explicit content type
        const { error: videoError, data: videoData } = await supabase.storage
          .from('dating-videos')
          .upload(videoFileName, videoFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: videoFile.type
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
        // Debug file info
        console.log("FILE DEBUG:", {
          file: avatarFile,
          isFile: avatarFile instanceof File,
          type: avatarFile?.type,
          size: avatarFile?.size,
          name: avatarFile?.name
        });
        
        // Validate file type
        if (!(avatarFile instanceof File)) {
          throw new Error("Invalid avatar file object");
        }
        
        const isValidImageType = avatarFile.type.startsWith("image/");
        if (!isValidImageType) {
          throw new Error(`Invalid file type: ${avatarFile.type}. Only images are allowed for avatars.`);
        }
        
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        
        // Upload with explicit content type
        const { error: avatarError, data: avatarData } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: avatarFile.type
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
