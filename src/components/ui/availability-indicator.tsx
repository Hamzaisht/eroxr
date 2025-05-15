
import React from "react";
import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/utils/media/types";

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const AvailabilityIndicator = ({
  status,
  size = 10,
  className,
  onClick,
}: AvailabilityIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case AvailabilityStatus.ONLINE:
        return "bg-green-500";
      case AvailabilityStatus.AWAY:
        return "bg-yellow-500";
      case AvailabilityStatus.BUSY:
        return "bg-red-500";
      case AvailabilityStatus.INVISIBLE:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "rounded-full border-2 border-background",
        getStatusColor(),
        className
      )}
      style={{ width: size, height: size }}
      onClick={onClick}
    />
  );
};

// Export AvailabilityStatus from the types file
export { AvailabilityStatus } from "@/utils/media/types";
