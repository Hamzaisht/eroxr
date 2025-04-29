
import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/utils/media/types";

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
  // Convert string to the correct type
  const normalizedStatus = status as AvailabilityStatus;
  
  return (
    <div 
      className={cn(
        "rounded-full",
        normalizedStatus === 'online' && "bg-green-500",
        normalizedStatus === 'offline' && "bg-gray-400",
        normalizedStatus === 'away' && "bg-yellow-500",
        normalizedStatus === 'busy' && "bg-red-500",
        normalizedStatus === 'invisible' && "bg-gray-400 opacity-50",
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
