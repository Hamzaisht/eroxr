import { cn } from "@/lib/utils";

export type AvailabilityStatus = "online" | "offline" | "away" | "busy";

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const AvailabilityIndicator = ({ 
  status, 
  size = 8,
  onClick,
  className 
}: AvailabilityIndicatorProps) => {
  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case "online":
        return "bg-emerald-500"; // Active on website
      case "busy":
        return "bg-rose-500";    // In call/video
      case "away":
        return "bg-amber-500";   // Messaging
      case "offline":
      default:
        return "bg-gray-500/80"; // Inactive/stagnant
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-full cursor-pointer border-2 border-white",
        getStatusColor(status),
        status === "online" && "animate-[pulse_20s_ease-in-out_infinite]",
        className
      )}
      style={{ 
        width: size,
        height: size,
      }}
    />
  );
};