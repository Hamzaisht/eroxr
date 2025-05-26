
import { cn } from "@/lib/utils";

interface MediaWatermarkProps {
  creatorHandle?: string;
  className?: string;
}

export const MediaWatermark = ({ 
  creatorHandle, 
  className = "bottom-2 right-2" 
}: MediaWatermarkProps) => {
  if (!creatorHandle) return null;

  return (
    <div className={cn(
      "absolute z-30 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80 font-mono",
      className
    )}>
      www.eroxr.com/@{creatorHandle}
    </div>
  );
};
