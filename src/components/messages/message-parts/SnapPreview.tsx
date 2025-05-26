
import { Camera, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface SnapPreviewProps {
  message: any;
  onClick?: () => void;
}

export const SnapPreview = ({ message, onClick }: SnapPreviewProps) => {
  const hasBeenViewed = !!message.viewed_at;
  
  return (
    <div 
      className={cn(
        "mt-2 w-56 h-32 rounded-md flex items-center justify-center cursor-pointer bg-gray-900/50 backdrop-blur-sm relative overflow-hidden border border-gray-700/50",
        hasBeenViewed ? "opacity-50" : "hover:bg-gray-900/70"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/20 to-luxury-dark/30" />
      
      <div className="flex flex-col items-center justify-center z-10">
        <Camera className="h-10 w-10 text-luxury-primary mb-2" />
        <p className="text-xs font-medium text-white">
          Snap feature coming soon
        </p>
      </div>
    </div>
  );
};
