
import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/utils/media/types";

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus | string;
  className?: string;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export function AvailabilityIndicator({ 
  status, 
  className,
  size,
  onClick
}: AvailabilityIndicatorProps) {
  // Convert string to the correct enum value if needed
  let normalizedStatus: AvailabilityStatus;
  
  if (typeof status === 'string') {
    switch (status.toLowerCase()) {
      case 'online':
        normalizedStatus = AvailabilityStatus.ONLINE;
        break;
      case 'away':
        normalizedStatus = AvailabilityStatus.AWAY;
        break;
      case 'busy':
        normalizedStatus = AvailabilityStatus.BUSY;
        break;
      case 'invisible':
        normalizedStatus = AvailabilityStatus.INVISIBLE;
        break;
      default:
        normalizedStatus = AvailabilityStatus.OFFLINE;
    }
  } else {
    normalizedStatus = status;
  }
  
  return (
    <div 
      className={cn(
        "rounded-full",
        normalizedStatus === AvailabilityStatus.ONLINE && "bg-green-500",
        normalizedStatus === AvailabilityStatus.OFFLINE && "bg-gray-400",
        normalizedStatus === AvailabilityStatus.AWAY && "bg-yellow-500",
        normalizedStatus === AvailabilityStatus.BUSY && "bg-red-500",
        normalizedStatus === AvailabilityStatus.INVISIBLE && "bg-gray-400 opacity-50",
        className
      )}
      style={{
        width: size ? `${size}px` : '12px',
        height: size ? `${size}px` : '12px',
      }}
      onClick={onClick}
    />
  );
}
