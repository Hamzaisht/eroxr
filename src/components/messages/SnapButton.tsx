
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface SnapButtonProps {
  onCaptureStart: () => void;
}

export const SnapButton = ({ onCaptureStart }: SnapButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className="h-9 w-9 rounded-full bg-gradient-to-tr from-luxury-accent/10 to-luxury-primary/10 hover:from-luxury-accent/20 hover:to-luxury-primary/20"
      onClick={() => alert("Snap feature coming soon")}
      aria-label="Take a snap"
    >
      <Camera className="h-5 w-5 text-luxury-primary" />
    </Button>
  );
};
