import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface SnapButtonProps {
  onSnapStart: () => void;
  onSnapEnd: () => void;
}

export const SnapButton = ({ onSnapStart, onSnapEnd }: SnapButtonProps) => {
  const snapTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const handleSnapPress = () => {
    onSnapStart();
    snapTimeoutRef.current = setTimeout(() => {
      onSnapEnd();
      toast({
        title: "Video mode",
        description: "Hold to record video, release to stop",
      });
    }, 30);
  };

  const handleSnapRelease = () => {
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
      onSnapEnd();
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="hover:bg-muted"
      onMouseDown={handleSnapPress}
      onMouseUp={handleSnapRelease}
      onTouchStart={handleSnapPress}
      onTouchEnd={handleSnapRelease}
    >
      <Camera className="h-4 w-4" />
    </Button>
  );
};