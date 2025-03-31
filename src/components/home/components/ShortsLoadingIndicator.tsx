
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ShortsLoadingIndicatorProps {
  isLoading: boolean;
  type?: 'fullscreen' | 'more';
}

export const ShortsLoadingIndicator = ({ isLoading, type = 'fullscreen' }: ShortsLoadingIndicatorProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (!isLoading) return null;
  
  if (type === 'more') {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-luxury-darker/80 rounded-full px-4 py-2 backdrop-blur-lg flex items-center">
          <Loader2 className="w-4 h-4 animate-spin text-luxury-primary mr-2" />
          <p className="text-luxury-neutral text-sm">Loading more videos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-luxury-darker/80 rounded-lg p-6 backdrop-blur-lg flex flex-col items-center">
        <Loader2 className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} animate-spin text-luxury-primary mb-2`} />
        <p className="text-luxury-neutral">Loading videos...</p>
      </div>
    </div>
  );
};
