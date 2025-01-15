import { useState, useEffect } from "react";
import { StoryViewer } from "./StoryViewer";
import { Story } from "@/integrations/supabase/types/story";
import { Creator } from "@/integrations/supabase/types/profile";

interface StoryItemProps {
  stories: Story[];
  creator: Creator;
  index: number;
}

export const StoryItem = ({ stories, creator, index }: StoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const firstStory = stories[0];

  useEffect(() => {
    const loadVideoThumbnail = async () => {
      if (firstStory.video_url) {
        try {
          // Create a video element to get duration
          const video = document.createElement('video');
          video.crossOrigin = "anonymous";
          video.src = firstStory.video_url;
          
          await new Promise((resolve) => {
            video.addEventListener('loadedmetadata', () => {
              // Set the current time to the middle of the video
              const middleTime = video.duration / 2;
              video.currentTime = middleTime;
              resolve(null);
            });
          });

          // Create a canvas to capture the frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          await new Promise((resolve) => {
            video.addEventListener('seeked', () => {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setPreviewUrl(canvas.toDataURL('image/jpeg'));
              }
              resolve(null);
            });
          });
        } catch (error) {
          console.error('Error generating video thumbnail:', error);
          // Fallback to the video URL if thumbnail generation fails
          setPreviewUrl(firstStory.video_url);
        }
      }
    };

    if (firstStory.video_url) {
      loadVideoThumbnail();
    }
  }, [firstStory.video_url]);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="w-28 rounded-xl border border-luxury-neutral/10 bg-gradient-to-br from-luxury-dark/50 to-luxury-primary/5 p-2 cursor-pointer hover:bg-luxury-neutral/5 transition-all duration-300 group"
      >
        <div className="relative mb-2">
          <div className="aspect-[3/4] rounded-lg overflow-hidden">
            {previewUrl && firstStory.video_url ? (
              <img
                src={previewUrl}
                alt={`${creator.username}'s story`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={firstStory.media_url || '/placeholder.svg'}
                alt={`${creator.username}'s story`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
        </div>
        <div className="text-center">
          <p className="text-sm text-luxury-neutral/60 truncate">
            {creator.username}
          </p>
        </div>
      </div>

      <StoryViewer
        open={isOpen}
        onOpenChange={setIsOpen}
        stories={stories}
        creator={creator}
      />
    </>
  );
};