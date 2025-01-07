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
  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "away":
        return "text-orange-500";
      case "busy":
        return "text-red-500";
      case "offline":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Circle
      className={cn(
        "fill-current",
        getStatusColor(status),
        className
      )}
      size={size}
    />
  );
}