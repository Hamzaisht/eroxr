
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
}

export const PremiumBadge = ({ className }: PremiumBadgeProps) => {
  return (
    <span className={cn("bg-luxury-primary/20 text-luxury-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1", className)}>
      <Award className="h-3 w-3" />
      <span>Premium</span>
    </span>
  );
};
