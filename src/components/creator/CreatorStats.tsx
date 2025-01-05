import { Star } from "lucide-react";

interface CreatorStatsProps {
  subscribers: number;
}

export const CreatorStats = ({ subscribers }: CreatorStatsProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground/60">{subscribers} subscribers</span>
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium text-foreground/70">4.9</span>
      </div>
    </div>
  );
};