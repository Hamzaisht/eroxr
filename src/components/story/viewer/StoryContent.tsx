
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UniversalMedia } from "@/components/media/UniversalMedia";

interface StoryContentProps {
  story: Story;
  onNext: () => void;
  isPaused: boolean;
}

export const StoryContent = ({ story, onNext, isPaused }: StoryContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMediaError, setHasMediaError] = useState(false);
  const { toast } = useToast();
  
  // Log content info for debugging
  console.log("Story content:", { 
    id: story.id, 
    type: story.content_type || story.media_type,
  });

  const handleMediaError = () => {
    console.error("Media failed to load:", story);
    setHasMediaError(true);
    
    toast({
      title: "Media Error",
      description: "Failed to load story content",
      variant: "destructive"
    });
  };

  // Error fallback component
  const ErrorFallback = ({ message }: { message: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
      <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );

  return (
    <motion.div
      key={story.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center bg-black"
    >
      <div className="relative w-full h-full">
        {hasMediaError ? (
          <ErrorFallback message="Media could not be loaded" />
        ) : (
          <UniversalMedia
            ref={videoRef}
            item={story}
            className="w-full h-full"
            onError={handleMediaError}
            autoPlay={!isPaused}
            controls={false}
            onClick={onNext}
          />
        )}
      </div>
    </motion.div>
  );
};
