import { cn } from "@/lib/utils";

export type AvailabilityStatus = "online" | "offline" | "away" | "busy";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  className?: string;
}

const statusStyles = {
  online: "bg-emerald-500/90 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse",
  offline: "bg-gray-500/80 shadow-[0_0_8px_rgba(107,114,128,0.3)]",
  away: "bg-amber-500/90 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse",
  busy: "bg-rose-500/90 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse"
};

export const AvailabilityIndicator = ({ 
  status, 
  size = 8,
  className 
}: AvailabilityIndicatorProps) => {
  return (
    <span 
      className={cn(
        "block rounded-full transition-all duration-300",
        statusStyles[status],
        className
      )}
      style={{ 
        width: size,
        height: size
      }}
    />
  );
};