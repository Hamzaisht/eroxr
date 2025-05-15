
import React from "react";
import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/utils/media/types";

export interface AvailabilityIndicatorProps {
  status?: AvailabilityStatus;
  size?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({
  status = AvailabilityStatus.OFFLINE,
  size = 12,
  className,
  onClick
}) => {
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
        "flex items-center justify-center rounded-full border-2 border-black",
        getStatusColor(),
        onClick ? "cursor-pointer" : "",
        className
      )}
      style={{ width: size, height: size }}
      onClick={onClick}
    />
  );
};
