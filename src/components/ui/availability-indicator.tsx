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
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          getStatusColor(status),
          status === "online" && "animate-[pulse_20s_ease-in-out_infinite]"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-black/5 backdrop-blur-sm",
          status === "online" && "animate-[pulse_20s_ease-in-out_infinite_0.5s]"
        )}
        style={{
          transform: "scale(1.2)",
          opacity: status === "online" ? 0.3 : 0
        }}
      />
    </div>
  );
};