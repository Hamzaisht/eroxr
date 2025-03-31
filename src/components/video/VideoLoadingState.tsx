
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

export const VideoLoadingState = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/50 backdrop-blur-sm z-10">
      <Loader2 className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} animate-spin text-luxury-primary`} />
    </div>
  );
};
