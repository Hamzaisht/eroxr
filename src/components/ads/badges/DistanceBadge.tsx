
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DistanceBadgeProps {
  distance?: number;
  className?: string;
}

export const DistanceBadge = ({ distance, className }: DistanceBadgeProps) => {
  return (
    <span className={cn("bg-gray-500/20 text-gray-300 text-xs px-2 py-0.5 rounded-full flex items-center gap-1", className)}>
      <MapPin className="h-3 w-3" />
      <span>{distance ? `${distance} km away` : "Unknown distance"}</span>
    </span>
  );
};
