
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { validateVideoFormat, getVideoDuration } from "@/utils/videoProcessing";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

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
      // Get username for watermark
      const username = await getUsernameForWatermark(session.user.id);
      
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
        
        // Apply watermark to video
        // For video, we'll use the CSS overlay watermark approach since
        // re-encoding videos on the client side is resource intensive
        
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
        
        // Apply watermark to image before uploading
        const watermarkedImage = await new Promise<Blob>((resolve, reject) => {
          const img = new Image();
          img.onload = function() {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
              }
              
              // Set canvas dimensions to match source
              canvas.width = img.width;
              canvas.height = img.height;
              
              // Draw image
              ctx.drawImage(img, 0, 0);
              
              // Add watermark
              const watermarkText = `www.eroxr.com/@${username}`;
              const fontSize = Math.max(16, Math.min(img.width * 0.025, 24));
              
              ctx.font = `600 ${fontSize}px sans-serif`;
              const metrics = ctx.measureText(watermarkText);
              const textWidth = metrics.width;
              
              // Position at bottom right with padding
              const padding = fontSize / 2;
              const x = canvas.width - textWidth - padding;
              const y = canvas.height - padding;
              
              // Add background
              ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
              ctx.fillRect(
                x - padding / 2,
                y - fontSize - padding / 2,
                textWidth + padding,
                fontSize + padding
              );
              
              // Draw text
              ctx.fillStyle = 'white';
              ctx.fillText(watermarkText, x, y - padding / 2);
              
              // Convert to blob
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Failed to convert canvas to blob"));
                }
              }, 'image/jpeg', 0.95);
            } catch (err) {
              reject(err);
            }
          };
          
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = URL.createObjectURL(avatarFile);
        });
        
        const avatarFileName = `${session.user.id}/${Date.now()}_avatar.jpg`;
        
        const { error: avatarError, data: avatarData } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, watermarkedImage, {
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
