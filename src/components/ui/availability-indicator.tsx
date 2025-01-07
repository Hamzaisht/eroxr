import { cn } from "@/lib/utils";

export type AvailabilityStatus = "online" | "offline" | "away" | "busy";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  className?: string;
}

const statusStyles = {
  online: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]",
  offline: "bg-gray-400",
  away: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]",
  busy: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
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