
import { cn } from "@/lib/utils";

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'idle' | 'dnd';

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  className?: string;
}

export function AvailabilityIndicator({ status, className }: AvailabilityIndicatorProps) {
  return (
    <div 
      className={cn(
        "h-3 w-3 rounded-full",
        status === 'online' && "bg-green-500",
        status === 'offline' && "bg-gray-400",
        status === 'away' && "bg-yellow-500",
        status === 'busy' && "bg-red-500",
        status === 'idle' && "bg-yellow-500",
        status === 'dnd' && "bg-red-500",
        className
      )}
    />
  );
}
