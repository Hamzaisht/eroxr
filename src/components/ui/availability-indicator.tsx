
import { cn } from "@/lib/utils";
import { AvailabilityStatus, stringToAvailabilityStatus } from "@/utils/media/types";

export type { AvailabilityStatus };

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
  // Convert string to enum if it's a string
  const normalizedStatus = typeof status === 'string' 
    ? stringToAvailabilityStatus(status) 
    : status;
  
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
