import { cn } from "@/lib/utils";

export type AvailabilityStatus = "online" | "offline" | "away" | "busy";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  className?: string;
}

const statusStyles = {
  online: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
  offline: "bg-gray-400",
  away: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
  busy: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
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