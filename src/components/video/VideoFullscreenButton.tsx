
import { RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoFullscreenButtonProps {
  containerRef: RefObject<HTMLDivElement>;
  setIsFullscreen: (isFullscreen: boolean) => void;
  toast: ReturnType<typeof useToast>["toast"];
}

export const VideoFullscreenButton = ({
  containerRef,
  setIsFullscreen,
  toast
}: VideoFullscreenButtonProps) => {
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return {
    toggleFullscreen
  };
};
