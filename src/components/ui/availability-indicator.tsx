import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AvailabilityStatus = "online" | "away" | "busy" | "offline";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  className?: string;
  size?: number;
}

export function AvailabilityIndicator({ 
  status, 
  className,
  size = 10 
}: AvailabilityIndicatorProps) {
  const getStatusStyles = (status: AvailabilityStatus) => {
    const baseStyles = "fill-current transition-all duration-300";
    switch (status) {
      case "online":
        return cn(baseStyles, "text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]");
      case "away":
        return cn(baseStyles, "text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]");
      case "busy":
        return cn(baseStyles, "text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]");
      case "offline":
        return cn(baseStyles, "text-gray-400");
      default:
        return cn(baseStyles, "text-gray-400");
    }
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center",
      "after:absolute after:inset-0 after:rounded-full after:blur-sm after:opacity-50",
      className
    )}>
      <Circle
        className={cn(getStatusStyles(status))}
        size={size}
      />
    </div>
  );
}