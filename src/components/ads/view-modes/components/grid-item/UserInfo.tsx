
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import type { DatingAd } from "../../../types/dating";

interface UserInfoProps {
  ad: DatingAd;
}

export const UserInfo = ({ ad }: UserInfoProps) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border-2 border-luxury-primary/30">
          <AvatarImage src={ad.avatar_url || undefined} />
          <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
            {ad.user?.username?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm text-white truncate max-w-[150px]">{ad.title}</h3>
          <p className="text-xs text-luxury-neutral">{ad.user?.username || "Anonymous"}</p>
        </div>
      </div>
      <div className="text-xs text-luxury-neutral flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        <span className="truncate max-w-[80px]">{ad.city}</span>
      </div>
    </div>
  );
};
