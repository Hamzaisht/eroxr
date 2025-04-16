
import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/utils/media/types";

export { AvailabilityStatus };

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
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
  return (
    <div 
      className={cn(
        "rounded-full",
        status === 'online' && "bg-green-500",
        status === 'offline' && "bg-gray-400",
        status === 'away' && "bg-yellow-500",
        status === 'busy' && "bg-red-500",
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
