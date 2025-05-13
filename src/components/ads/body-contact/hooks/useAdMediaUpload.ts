
import { useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";

interface MediaUploadResult {
  videoUrl: string | null;
  avatarUrl: string | null;
  error?: string;
}

export const useAdMediaUpload = () => {
  const session = useSession();
  // Critical: Use refs instead of state for file objects
  const videoFileRef = useRef<File | null>(null);
  const avatarFileRef = useRef<File | null>(null);

  const setVideoFile = (file: File | null) => {
    videoFileRef.current = file;
  };

  const setAvatarFile = (file: File | null) => {
    avatarFileRef.current = file;
  };

  const uploadMedia = async (): Promise<MediaUploadResult> => {
    if (!session?.user?.id) {
      return { videoUrl: null, avatarUrl: null, error: "No user session found" };
    }

    let videoUrl = null;
    let avatarUrl = null;

    try {
      // Video Upload Process
      if (videoFileRef.current) {
        const videoFile = videoFileRef.current;
        
        // CRITICAL: Run comprehensive file diagnostic
        runFileDiagnostic(videoFile);
        
        // CRITICAL: Strict file validation
        if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
          console.error("❌ Invalid Video File passed to uploader", videoFile);
          throw new Error("Only raw File instances with data can be uploaded");
        }
        
        // CRITICAL: Debug file info
        console.log("FILE DEBUG:", {
          file: videoFile,
          isFile: videoFile instanceof File,
          type: videoFile?.type,
          size: videoFile?.size,
          name: videoFile?.name
        });
        
        // Validate file type
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
        
        // CRITICAL: Upload with explicit content type and upsert: true
        const { error: videoError, data: videoData } = await supabase.storage
          .from('dating-videos')
          .upload(videoFileName, videoFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: videoFile.type
          });

        if (videoError) {
          console.error("Video upload error:", videoError);
          throw new Error(`Video upload failed: ${videoError.message}`);
        }

        console.log("Video upload successful:", videoData);
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('dating-videos')
          .getPublicUrl(videoFileName);
        
        // CRITICAL: Verify and log the result
        if (publicUrl) {
          console.log("✅ Supabase Video URL:", publicUrl);
          videoUrl = publicUrl;
        } else {
          console.error("❌ Supabase Video URL missing");
          throw new Error("Failed to get public URL for video");
        }
        
        console.log("Generated video URL:", videoUrl);
      }

      // Avatar Upload Process
      if (avatarFileRef.current) {
        const avatarFile = avatarFileRef.current;
        
        // CRITICAL: Run comprehensive file diagnostic
        runFileDiagnostic(avatarFile);
        
        // CRITICAL: Strict file validation
        if (!avatarFile || !(avatarFile instanceof File) || avatarFile.size === 0) {
          console.error("❌ Invalid Avatar File passed to uploader", avatarFile);
          throw new Error("Only raw File instances with data can be uploaded");
        }
        
        // CRITICAL: Debug file info
        console.log("FILE DEBUG:", {
          file: avatarFile,
          isFile: avatarFile instanceof File,
          type: avatarFile?.type,
          size: avatarFile?.size,
          name: avatarFile?.name
        });
        
        // Validate file type
        const isValidImageType = avatarFile.type.startsWith("image/");
        if (!isValidImageType) {
          throw new Error(`Invalid file type: ${avatarFile.type}. Only images are allowed for avatars.`);
        }
        
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        
        // CRITICAL: Upload with explicit content type and upsert: true
        const { error: avatarError, data: avatarData } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: avatarFile.type
          });

        if (avatarError) {
          console.error("Avatar upload error:", avatarError);
          throw new Error(`Avatar upload failed: ${avatarError.message}`);
        }

        console.log("Avatar upload successful:", avatarData);
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarFileName);
        
        // CRITICAL: Verify and log the result
        if (publicUrl) {
          console.log("✅ Supabase Avatar URL:", publicUrl);
          avatarUrl = publicUrl;
        } else {
          console.error("❌ Supabase Avatar URL missing");
          throw new Error("Failed to get public URL for avatar");
        }
        
        console.log("Generated avatar URL:", avatarUrl);
      }

      return { videoUrl, avatarUrl };
    } catch (error: any) {
      console.error("Media upload error:", error);
      return { videoUrl: null, avatarUrl: null, error: error.message };
    }
  };

  return { 
    uploadMedia, 
    setVideoFile, 
    setAvatarFile 
  };
};
