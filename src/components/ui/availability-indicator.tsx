
import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/utils/media/types";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  className?: string;
}

export { AvailabilityStatus };

export function AvailabilityIndicator({ 
  status, 
  size = 10, 
  className 
}: AvailabilityIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case AvailabilityStatus.ONLINE:
        return "bg-green-500";
      case AvailabilityStatus.AWAY:
        return "bg-yellow-500";
      case AvailabilityStatus.BUSY:
        return "bg-red-500";
      case AvailabilityStatus.INVISIBLE:
        return "bg-gray-500";
      case AvailabilityStatus.OFFLINE:
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        className={`${getStatusColor()} rounded-full animate-pulse`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px` 
        }}
      />
    </div>
  );
}
