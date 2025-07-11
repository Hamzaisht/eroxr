
import { Camera, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface SnapPreviewProps {
  message: any;
  onClick?: () => void;
}

export const SnapPreview = ({ message, onClick }: SnapPreviewProps) => {
  const hasBeenViewed = !!message.viewed_at;
  const isExpired = message.expires_at && new Date(message.expires_at) < new Date();
  
  const handleClick = async () => {
    if (!hasBeenViewed && !isExpired && onClick) {
      // Mark as viewed when clicked
      const { error } = await supabase.from('direct_messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', message.id);
      
      if (!error) {
        onClick();
      }
    }
  };
  
  if (isExpired && !hasBeenViewed) {
    return (
      <div className="mt-2 w-56 h-32 rounded-md flex items-center justify-center bg-gray-900/50 backdrop-blur-sm relative overflow-hidden border border-gray-700/50 opacity-50">
        <div className="flex flex-col items-center justify-center z-10">
          <Timer className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-xs font-medium text-gray-400">
            Snap expired
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "mt-2 w-56 h-32 rounded-md flex items-center justify-center cursor-pointer bg-gray-900/50 backdrop-blur-sm relative overflow-hidden border border-gray-700/50",
        hasBeenViewed ? "opacity-50" : "hover:bg-gray-900/70"
      )}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/20 to-luxury-dark/30" />
      
      <div className="flex flex-col items-center justify-center z-10">
        <Camera className="h-10 w-10 text-luxury-primary mb-2" />
        <p className="text-xs font-medium text-white">
          {hasBeenViewed ? "Viewed" : "Tap to view"}
        </p>
        {!hasBeenViewed && (
          <p className="text-xs text-white/60 mt-1">
            Disappears after viewing
          </p>
        )}
      </div>
    </div>
  );
};
