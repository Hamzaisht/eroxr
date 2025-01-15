import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { VideoPreview } from "./VideoPreview";

interface StoryItemProps {
  story: Story;
  onClick: () => void;
}

export const StoryItem = ({ story, onClick }: StoryItemProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateVideoThumbnail = async () => {
      if (!story.video_url) return;

      try {
        const video = document.createElement('video');
        video.src = story.video_url;
        
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            // Seek to middle of video
            video.currentTime = video.duration / 2;
            resolve(null);
          };
        });

        await new Promise((resolve) => {
          video.onseeked = () => {
            // Create canvas and draw video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to data URL
            const thumbnailUrl = canvas.toDataURL('image/jpeg');
            setPreviewUrl(thumbnailUrl);
            resolve(null);
          };
        });
      } catch (error) {
        console.error('Error generating video thumbnail:', error);
        // Fallback to video URL if thumbnail generation fails
        setPreviewUrl(story.video_url);
      }
    };

    if (story.video_url) {
      generateVideoThumbnail();
    }
  }, [story.video_url]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative mb-2">
        <div className="aspect-[3/4] rounded-lg overflow-hidden">
          {story.video_url ? (
            <VideoPreview
              videoUrl={story.video_url}
              previewUrl={previewUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={story.media_url || ''}
              alt="Story preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-luxury-neutral/60">
          {new Date(story.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
};