
import { Eye, MessageCircle } from "lucide-react";
import type { DatingAd } from "../../../types/dating";

interface AdStatsProps {
  ad: DatingAd;
}

export const AdStats = ({ ad }: AdStatsProps) => {
  return (
    <div className="flex items-center justify-between text-xs text-luxury-neutral/80 mt-3">
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        <span>{ad.view_count || 0}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-3 w-3" />
        <span>{ad.message_count || 0}</span>
      </div>
    </div>
  );
};
