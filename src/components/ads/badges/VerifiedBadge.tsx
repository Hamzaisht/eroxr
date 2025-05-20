
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
}

export const VerifiedBadge = ({ className }: VerifiedBadgeProps) => {
  return (
    <span className={cn("bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1", className)}>
      <CheckCircle className="h-3 w-3" />
      <span>Verified</span>
    </span>
  );
};
