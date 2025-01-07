import { cn } from "@/lib/utils";

export type AvailabilityStatus = "online" | "offline" | "away" | "busy";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  className?: string;
}

export const AvailabilityIndicator = ({
  status,
  size = 8,
  className,
}: AvailabilityIndicatorProps) => {
  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "away":
        return "bg-amber-500";
      case "busy":
        return "bg-rose-500";
      case "offline":
      default:
        return "bg-gray-500/80";
    }
  };

  return (
    <div
      className={cn(
        "rounded-full",
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