
import React from "react";
import { cn } from "@/lib/utils";

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

export interface AvailabilityIndicatorProps {
  status?: AvailabilityStatus;
  size?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({
  status = 'offline',
  size = 12,
  className,
  onClick
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return "bg-green-500";
      case 'away':
        return "bg-yellow-500";
      case 'busy':
        return "bg-red-500";
      case 'invisible':
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
